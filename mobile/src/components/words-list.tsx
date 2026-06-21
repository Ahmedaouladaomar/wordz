import { delay } from "@/api/client";
import { vocabularyService } from "@/services/vocabularyService";
import { Vocabulary } from "@/types/vocabulary";
import { X } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "react-native-sonner";
import { Anchor, Paragraph, Text, XStack, YStack } from "tamagui";
import { CircleSpinner } from "./ui/circle-spinner";
import { WordCard } from "./word-card";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function WordsList({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>();

  const [isInitLoading, setIsInitLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [page, setPage] = useState(1);

  const hasNextPage = meta && meta.hasNextPage;

  const getVocabularies = async () => {
    const isFirstPage = page === 1;
    const setIsLoading = isFirstPage ? setIsInitLoading : setIsLoadingMore;

    if (!isFirstPage && isLoadingMore) return;

    try {
      setIsLoading(true);

      const response = await vocabularyService.getVocabularies({
        page,
        orderBy: "createdAt",
        sortOrder: "DESC",
        take: 5,
      });

      await delay(500);

      if (response.success && response.data) {
        const newValues = isFirstPage
          ? response.data.items
          : [...favorites, ...response.data.items];

        setFavorites(newValues);
        setMeta(response.data.meta);
      } else {
        toast.error(response.message || "Failed to fetch words");
      }
    } catch {
      toast.error("An error occurred while fetching words");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVocabularies();
  }, [page]);

  const onLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const renderItem = ({ item }: { item: Vocabulary }) => (
    <WordCard
      key={item.id}
      id={item.id}
      status={
        item.isFavourite ? "favourite" : item.isMastered ? "mastered" : null
      }
      title={item.term}
      description={item.definition}
      addedAt={item.createdAt}
    />
  );

  const renderEmptyState = () =>
    isInitLoading ? (
      <YStack pt="$20">
        <CircleSpinner size={50} />
      </YStack>
    ) : (
      <YStack ai="center" jc="center" px="$8" pt="$15" pb="$8" mt="$8" gap="$4">
        <Text fos="$md" fow="600">
          No words saved yet
        </Text>
        <Paragraph ta="center" size="$3" fow="300">
          Add new words through words tab add button or through add word tab.
        </Paragraph>
      </YStack>
    );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={[styles.backdrop]} onPress={onClose} />

      {/* Modal Content */}
      <YStack
        bc="$brandPrimaryLight"
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        {/* Header */}
        <XStack style={styles.header}>
          <XStack f={1} />
          <Text
            fos="$lg"
            fow={600}
            col="$brandPrimary"
            f={2}
            style={{ textAlign: "center" }}
          >
            Words List
          </Text>
          <XStack f={1} jc="flex-end">
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} col="$brandPrimary" />
            </TouchableOpacity>
          </XStack>
        </XStack>

        {/* Scrollable Content */}
        <FlatList
          style={{ width: "100%", paddingHorizontal: 5 }}
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: 16,
            flexGrow: 1,
          }}
          ListFooterComponent={() =>
            hasNextPage && (
              <XStack f={1} jc="center" p={10}>
                {isLoadingMore ? (
                  <CircleSpinner />
                ) : (
                  <Anchor
                    fos={15}
                    fow={500}
                    col="$brandPrimary"
                    py={5}
                    onPress={onLoadMore}
                  >
                    Load more
                  </Anchor>
                )}
              </XStack>
            )
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </YStack>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5,
  },
  closeButton: {
    padding: 8,
  },
  term: {
    fontSize: 24,
    fontWeight: "700",
  },
});

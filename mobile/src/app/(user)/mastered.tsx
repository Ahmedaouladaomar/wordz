import { delay } from "@/api/client";
import { CircleSpinner } from "@/components/ui/circle-spinner";
import { WordCard } from "@/components/word-card";
import { vocabularyService } from "@/services/vocabularyService";
import { Vocabulary } from "@/types/vocabulary";
import { ArrowLeft } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "react-native-sonner";
import { Anchor, Button, Paragraph, Text, XStack, YStack } from "tamagui";

interface Props {
  onBack: () => any;
  [key: string]: any;
}

export default function MasteredScreen({ onBack, ...styles }: Props) {
  const insets = useSafeAreaInsets();
  const [mastered, setMastered] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>();

  const [isInitLoading, setIsInitLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [page, setPage] = useState(1);

  const hasNextPage = meta && meta.hasNextPage;

  const fetchFavourites = async () => {
    const isFirstPage = page === 1;
    const setIsLoading = isFirstPage ? setIsInitLoading : setIsLoadingMore;

    if (!isFirstPage && isLoadingMore) return;

    try {
      setIsLoading(true);

      const response = await vocabularyService.getVocabularies({
        page,
        orderBy: "createdAt",
        sortOrder: "DESC",
        take: 4,
        isMastered: true,
      });

      await delay(500);

      if (response.success && response.data) {
        const newValues = isFirstPage
          ? response.data.items
          : [...mastered, ...response.data.items];

        setMastered(newValues);
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
    fetchFavourites();
  }, [page]);

  const onLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const renderItem = ({ item }: { item: Vocabulary }) => (
    <WordCard
      key={item.id}
      id={item.id}
      status="mastered"
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
          No mastered words yet
        </Text>
        <Paragraph ta="center" size="$3" fow="300">
          Go to practice tab and start your practice session and mastered words
          will appear here.
        </Paragraph>
      </YStack>
    );

  return (
    <YStack f={1} bc="$brandPrimaryLight" pt={insets.top} {...styles}>
      {/* Header Section */}
      <XStack
        bc="$background"
        boc="#7eb5be46"
        bbw={1}
        px="$5"
        pb="$3"
        mb="$2"
        ai="center"
        jc="space-between"
      >
        <XStack f={1}>
          <Button icon={ArrowLeft} size={45} onPress={onBack} />
        </XStack>
        <YStack f={1} ai="center">
          <XStack ai="center" gap="$3">
            <Text fos="$lg" fow="600" col="$brandPrimary">
              Mastered
            </Text>
          </XStack>
        </YStack>
        <XStack f={1}></XStack>
      </XStack>

      {/* Scrollable Content Container */}
      <FlatList
        style={{ width: "100%" }}
        data={mastered}
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
  );
}

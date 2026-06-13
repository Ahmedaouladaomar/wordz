import { delay } from "@/api/client";
import { CircleSpinner } from "@/components/ui/circle-spinner";
import { WordCard } from "@/components/word-card";
import { vocabularyService } from "@/services/vocabularyService";
import { Vocabulary } from "@/types/vocabulary";
import { ArrowLeft, Heart } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "react-native-sonner";
import { Anchor, Button, H2, Paragraph, Text, XStack, YStack } from "tamagui";

export default function FavouritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>();

  const [isInitLoading, setIsInitLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [page, setPage] = useState(1);

  console.log(meta);

  const hasNextPage = meta && meta.hasNextPage;

  const fetchFavourites = async () => {
    const isFirstPage = page === 1;
    const setIsLoading = isFirstPage ? setIsInitLoading : setIsLoadingMore;
    try {
      setIsLoading(true);

      const response = await vocabularyService.getVocabularies({
        page: 1,
        orderBy: "createdAt",
        sortOrder: "DESC",
        take: 4,
        isFavourite: true,
      });

      await delay(500);

      if (response.success && response.data) {
        setFavorites(response.data.items);
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

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const onLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Render Card Component using Tamagui layout primitives
  const renderItem = ({ item }: { item: Vocabulary }) => (
    <WordCard
      id={item.id}
      status="favourite"
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
          No favorites yet
        </Text>
        <Paragraph ta="center" size="$3" fow="300">
          Tap the heart icon on vocabulary words to save them here.
        </Paragraph>
      </YStack>
    );

  return (
    <YStack f={1} bc="$brandPrimaryLight" pt={insets.top}>
      {/* Header Section */}
      <XStack
        bc="$background"
        bbw={1}
        boc="#7eb5be46"
        px="$5"
        py="$4"
        ai="center"
        jc="space-between"
      >
        <YStack>
          <XStack ai="center" gap="$3">
            <Heart size={24} col="$brandPrimary" />
            <H2 fos="$6" fow="600" col="$brandPrimary">
              Favorites
            </H2>
          </XStack>
          <Paragraph size="$2" col="$brandPrimary" mt="$1" fow={400}>
            {favorites.length} {favorites.length === 1 ? "word" : "words"} saved
          </Paragraph>
        </YStack>
        <Button
          icon={ArrowLeft}
          size={45}
          onPress={() => router.push("/(user)/(tabs)/words")}
        />
      </XStack>

      <YStack w="100%" ai="center">
        {/* Scrollable Content Container */}
        <FlatList
          style={{ width: "100%" }}
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />

        {hasNextPage && (
          <XStack ai="center">
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
        )}
      </YStack>
    </YStack>
  );
}

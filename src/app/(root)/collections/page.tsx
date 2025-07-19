import { getSavedCollections } from "@/lib/actions/collection.action";

import QuestionCard from "@/components/layout/cards/QuestionCard";
import LocalSearch from "@/components/layout/search/LocalSearch";
import DataRenderer from "@/components/ui/DataRenderer";

import { ROUTES } from "@/constants/routes";
import { STATES } from "@/constants/states";
import { SearchParams } from "@/types/global";

// const test = async () => {
//   try {
//     const validatedUrl = await ImageUrlSchema.safeParseAsync({
//       imageUrl: "https://mongoosejs.com/",
//     });
//     if (!validatedUrl.success)
//       throw new ValidationError(validatedUrl.error.flatten().fieldErrors);

//     return validatedUrl;
//   } catch (error) {
//     return handleError(error);
//   }
// };

export default async function Collections({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getSavedCollections({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { collection } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          className="flex-1"
          route={ROUTES.COLLECTIONS}
        />
      </div>
      {/*  */}
      {/* {success ? (
        <div className="mt-10 flex w-full flex-col gap-6">
          {questions && questions.length > 0 ? (
            questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))
          ) : (
            <div className="mt-10 flex w-full items-center justify-center">
              <p className="text-dark400_light700">No questions found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 flex w-full items-center justify-center">
          <p className="text-dark400_light700">
            {error?.message || "Something went wrong"}
          </p>
        </div>
      )} */}
      <DataRenderer
        success={success}
        error={error}
        data={collection}
        empty={STATES.EMPTY_COLLECTION}
        render={(collection) =>
          collection.map((item) => (
            <QuestionCard key={item._id} question={item.questions} />
          ))
        }
      />
    </>
  );
}

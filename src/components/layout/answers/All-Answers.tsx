import React from "react";

import DataRenderer from "@/components/ui/DataRenderer";

import CommonFilter from "../filters/CommonFilter";
import Pagination from "../Pagination";

import AnswerCard from "./AnswerCard";

import { AnswerFilters } from "@/constants/filters";
import { STATES } from "@/constants/states";
import { ActionResponse, AnswerType } from "@/types/global";

interface Props extends ActionResponse<AnswerType[]> {
  totalAnswers: number;
  page: number;
  isNext: boolean;
}

function AllAnswers({
  data,
  success,
  error,
  totalAnswers,
  page,
  isNext,
}: Props) {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>

        <CommonFilter
          filters={AnswerFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <DataRenderer
        data={data}
        success={success}
        error={error}
        empty={STATES.EMPTY_ANSWERS}
        render={(answers) =>
          answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)
        }
      />

      <Pagination page={page} isNext={isNext || false} />
    </div>
  );
}

export default AllAnswers;

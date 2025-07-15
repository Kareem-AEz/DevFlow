import React from "react";

import DataRenderer from "@/components/ui/DataRenderer";

import AnswerCard from "./AnswerCard";

import { STATES } from "@/constants/states";
import { ActionResponse, AnswerType } from "@/types/global";

interface Props extends ActionResponse<AnswerType[]> {
  totalAnswers: number;
}

function AllAnswers({ data, success, error, totalAnswers }: Props) {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>

        <p>Filters</p>
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
    </div>
  );
}

export default AllAnswers;

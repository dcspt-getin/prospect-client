/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, Segment, Divider } from "semantic-ui-react";
import ReactECharts from "echarts-for-react";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import useQuestions from "hooks/useQuestions";
import questionTypes from "helpers/questions/questionTypes";

import useResultsData from "./hooks/useResultsData";

export default () => {
  const [t] = useTranslations("contacts");
  const { questions } = useQuestions();
  const results = useResultsData();

  const pairWiseQuestion = questions.filter(
    (q) => q.question_type === questionTypes.PAIRWISE_COMBINATIONS
  );
  const _getPairWiseData = (q) => {
    const allQuestionValues = results
      .map((r) => (r.profile_data || {})[q.id]?.value)
      .filter(Boolean)
      .map((v) => {
        const eigenVector = v.find((entry) => entry.key === "eigenVector");
        return eigenVector?.value;
      })
      .reduce((acc, curr) => {
        Object.keys(curr).forEach((key) => {
          acc[key] = (acc[key] || 0) + curr[key];
        });

        return {
          ...acc,
          count: (acc.count || 0) + 1,
        };
      }, {});

    return q.options.map((o) => {
      return allQuestionValues[o.id] / allQuestionValues.count;
    });
  };

  return (
    <Dashboard>
      <div className="p-4">
        <Header size="huge" as="h1">
          {t("Resultados")}
        </Header>
      </div>
      <Segment>
        {pairWiseQuestion.map((q) => (
          <div key={q.id}>
            <ReactECharts
              option={{
                title: {
                  text: q.title,
                },
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "shadow",
                  },
                },
                legend: {},
                grid: {
                  left: "3%",
                  right: "4%",
                  bottom: "3%",
                  containLabel: true,
                },
                xAxis: {
                  type: "value",
                  boundaryGap: [0, 0.01],
                },
                yAxis: {
                  type: "category",
                  data: q.options.map((o) => o.title),
                },
                series: [
                  {
                    name: "",
                    type: "bar",
                    data: _getPairWiseData(q),
                  },
                ],
              }}
              notMerge={true}
              lazyUpdate={true}
              // theme={"theme_name"}
              // onChartReady={this.onChartReadyCallback}
              // onEvents={EventsDict}
              // opts={}
            />
            <Divider />
          </div>
        ))}
      </Segment>
    </Dashboard>
  );
};

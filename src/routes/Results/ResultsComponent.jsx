/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, Segment, Divider } from "semantic-ui-react";
import ReactECharts from "echarts-for-react";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import useQuestions from "hooks/useQuestions";
import questionTypes from "helpers/questions/questionTypes";

export default () => {
  const [t] = useTranslations("contacts");
  const { questions } = useQuestions();

  const pairWiseQuestion = questions.filter(
    (q) => q.question_type === questionTypes.PAIRWISE_COMBINATIONS
  );
  const _getPairWiseData = (q) => {
    return q.options.map((o) => {
      return Math.random() * 100;
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

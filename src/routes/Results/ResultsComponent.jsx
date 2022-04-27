/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, Segment, Divider, Grid, Dropdown } from "semantic-ui-react";
import ReactECharts from "echarts-for-react";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import useQuestions from "hooks/useQuestions";
import questionTypes from "helpers/questions/questionTypes";

import useResultsData from "./hooks/useResultsData";
import useGroups from "./hooks/useGroups";

export default () => {
  const [t] = useTranslations("contacts");
  const { questions } = useQuestions(true);
  const results = useResultsData();
  const groups = useGroups();
  const [selectedGroup, setSelectedGroup] = React.useState(null);

  const pairWiseQuestion = React.useMemo(
    () =>
      questions.filter(
        (q) =>
          q.question_type === questionTypes.PAIRWISE_COMBINATIONS &&
          q.groups.some((g) => g.id === selectedGroup)
      ),
    [questions, selectedGroup]
  );
  const _getPairWiseData = (q) => {
    const allQuestionValues = results
      .filter((r) => (r.profile_data || {})[q.id]?.meta?.hasValidR2)
      .map((r) => (r.profile_data || {})[q.id]?.value)
      .filter(Boolean)
      .map((v) => {
        const eigenVector = v.find((entry) => entry.key === "eigenVector");
        return eigenVector?.value;
      })
      .filter(Boolean)
      .reduce((acc, curr) => {
        Object.keys(curr).forEach((key) => {
          acc[key] = (acc[key] || 0) + curr[key];
        });

        return {
          ...acc,
          count: (acc.count || 0) + 1,
        };
      }, {});

    const onlyValues = Object.keys(allQuestionValues).reduce((acc, key) => {
      if (key === "count") return acc;

      return {
        ...acc,
        [key]: allQuestionValues[key] / allQuestionValues.count,
      };
    }, {});
    const max = Math.max(...Object.values(onlyValues));

    return q.options
      .map((o) => {
        const value = onlyValues[o.id];

        const percentageValue = parseInt((value * 100) / max);
        return {
          title: o.title,
          value: percentageValue,
        };
      })
      .sort((a, b) => a.value - b.value);
  };
  const _renderQuestions = () => {
    if (!pairWiseQuestion.length) return "";

    return (
      <Segment>
        {pairWiseQuestion.map((q) => {
          const data = _getPairWiseData(q);

          return (
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
                    formatter: (params) => {
                      return `${params[0].value}`;
                    },
                  },
                  legend: {},
                  grid: {
                    left: "35%",
                    right: "4%",
                    bottom: "10%",
                    containLabel: false,
                  },
                  axisLabel: {
                    interval: 0,
                    width:
                      document.querySelector(".App > div").offsetWidth * 0.3, //fixed number of pixels
                    overflow: "break", // or 'break' to continue in a new line
                  },
                  xAxis: {
                    type: "value",
                    boundaryGap: [0, 0.01],
                    min: 0,
                    max: 100,
                  },
                  yAxis: {
                    type: "category",
                    data: data.map((o) => o.title),
                  },
                  series: [
                    {
                      name: "",
                      type: "bar",
                      data: data.map((o) => o.value),
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
          );
        })}
      </Segment>
    );
  };

  return (
    <Dashboard>
      <div className="p-4">
        <Header size="huge" as="h1">
          {t("Resultados")}
        </Header>
      </div>
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Dropdown
              placeholder="Seleccione o grupo"
              options={groups.map((g) => ({
                key: g.id,
                value: g.id,
                text: g.name,
              }))}
              selection
              fluid
              // search
              onChange={(e, { value }) => setSelectedGroup(value)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {selectedGroup && _renderQuestions()}
    </Dashboard>
  );
};

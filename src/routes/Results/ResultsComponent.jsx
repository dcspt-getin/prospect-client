/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import {
  Header,
  Segment,
  Divider,
  Grid,
  Dropdown,
  Checkbox,
} from "semantic-ui-react";
import ReactECharts from "echarts-for-react";
import ceil from "lodash/ceil";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import useQuestions from "hooks/useQuestions";
import questionTypes from "helpers/questions/questionTypes";
import useUserProfile from "hooks/useUserProfile";

import useResultsData from "./hooks/useResultsData";
import useGroups from "./hooks/useGroups";

export default () => {
  const [t] = useTranslations("contacts");
  const { questions } = useQuestions(true);
  const groups = useGroups();
  const [userProfile] = useUserProfile();
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [showGlobalResults, setShowGlobalResults] = React.useState(true);
  const [showUserResults, setShowUserResults] = React.useState(false);
  const results = useResultsData(selectedGroup);

  const totals = React.useMemo(() => {
    const questionsOnGroup = questions.filter((q) =>
      q.groups.some((g) => g.id === selectedGroup)
    );
    const totalProfilesWithAnswer = results.filter(
      (result) => result.profile_data !== null
    ).length;
    const totalCompletedProfiles = results.filter(
      (result) =>
        result.profile_data &&
        questionsOnGroup.every((q) => result.profile_data[q.id] !== undefined)
    ).length;

    return {
      totalProfilesWithAnswer,
      totalCompletedProfiles,
    };
  }, [results]);

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
        const userValue =
          (userProfile && (userProfile[q.id]?.meta?.eigenVector || {})[o.id]) ||
          0;
        const maxUser = Math.max(
          ...Object.values(
            userProfile && (userProfile[q.id]?.meta?.eigenVector || {})
          )
        );

        const percentageValue = parseInt((value * 100) / max);
        const userValueNormalized = parseInt(
          (ceil(userValue, 2) * 100) / ceil(maxUser, 2)
        );

        return {
          title: o.title,
          value: percentageValue,
          userValue: userValueNormalized,
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
                      return params
                        .map(
                          (p) =>
                            `<span style="display:inline-block;background-color: ${p.color};width: 12px; height: 12px;margin-right: 4px;"></span>${p.value}`
                        )
                        .join("<br/>");
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
                    axisLabel: {
                      fontSize:
                        document.querySelector(".App > div").offsetWidth > 600
                          ? "16"
                          : "12",
                    },
                  },
                  series: [
                    ...(showGlobalResults
                      ? [
                          {
                            name: "",
                            type: "bar",
                            itemStyle: { color: "#2185d0" },
                            data: data.map((o) => o.value),
                          },
                        ]
                      : []),
                    ...(showUserResults
                      ? [
                          {
                            name: "",
                            type: "bar",
                            itemStyle: { color: "green" },
                            data: data.map((o) => o.userValue),
                          },
                        ]
                      : []),
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
      {selectedGroup && (
        <Grid>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={8} computer={4}>
              <Segment>
                <Checkbox
                  checked={showUserResults}
                  onChange={() => setShowUserResults(!showUserResults)}
                  label="Meus resultados"
                />
              </Segment>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={4}>
              <Segment>
                <Checkbox
                  checked={showGlobalResults}
                  onChange={() => setShowGlobalResults(!showGlobalResults)}
                  label="Resultados globais"
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Segment>
                <strong>Numero de questionarios com resposta: </strong>{" "}
                {totals.totalProfilesWithAnswer}
                <br />
                <strong>Numero de questionarios completos: </strong>
                {totals.totalCompletedProfiles}{" "}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
      {selectedGroup && _renderQuestions()}
    </Dashboard>
  );
};

import React from "react";
import { Grid, Button, Header } from "semantic-ui-react";
import styled from "styled-components";
import isEqual from "lodash/isEqual";

import { filterIterationsWithValue } from "helpers/questions/pairWiseCombinations";
import calcEigenVector from "helpers/questions/calcEigenVector";
import Balance from "components/WeightBalance/Balance";
import { shuffleArray } from "utils";
import { getQuestionEndTime } from "routes/Profile/helpers/helpers";
import useTranslations from "hooks/useTranslations";

const WeightPairwiseCombinations = ({
  id,
  options,
  value,
  meta,
  onChange,
  disabled,
  showPreviousIteration,
  correlationLimitValue,
  allowUserRepeatQuestion,
  renderOptionInfo,
  showBalance,
  styleProps = {},
}) => {
  const [t] = useTranslations("profile");
  const [optionsMatrix, setOptionsMatrix] = React.useState([]);
  const [iterationsToRepeat, setIterationsToRepeat] = React.useState([]);
  const [iteration, setIteration] = React.useState(null);

  React.useEffect(() => {
    if (iterationsToRepeat.length === 0) return;

    setIteration(iterationsToRepeat[0]);
  }, [iterationsToRepeat]);

  React.useEffect(() => {
    if (options.length < 2) return;

    const sortedOptions = options.sort((a, b) => a.row_order - b.row_order);
    const _optionsMatix = sortedOptions.reduce((acc, curr) => {
      return [
        ...acc,
        ...sortedOptions
          .filter(
            (o) =>
              !acc.find(
                (_o) =>
                  (_o.option1.id === curr.id && _o.option2.id === o.id) ||
                  (_o.option2.id === curr.id && _o.option1.id === o.id)
              ) && curr.id !== o.id
          )
          .map((o) => ({
            option1: curr,
            option2: o,
            value: undefined,
          })),
      ];
    }, []);

    if (!Array.isArray(value)) {
      onChange(
        _optionsMatix.map((o) => ({
          option1: o.option1.id,
          option2: o.option2.id,
        }))
      );
    }
    setOptionsMatrix(shuffleArray(_optionsMatix));
  }, [options, id]);

  React.useEffect(() => {
    setIteration(null);
    setIterationsToRepeat([]);
  }, [id]);

  React.useEffect(() => {
    const allInterationsDone =
      Array.isArray(value) &&
      value
        .filter(filterIterationsWithValue)
        .every((v) => v.value !== undefined && v.value !== null);

    if (allInterationsDone && iteration === null) {
      setIteration(-1);
    } else if (iteration === null) {
      setIteration(0);
    }
  }, [value, iteration]);

  const currentIteration = optionsMatrix[iteration];
  const currentIteratonValue =
    Array.isArray(value) &&
    value.find(
      (v) =>
        v.option1 === currentIteration?.option1?.id &&
        v.option2 === currentIteration?.option2?.id
    )?.value;

  const _onIterationValueChange = async (val) => {
    let _newValue = [
      ...(value || []).filter(
        (v) =>
          v.option1 !== currentIteration.option1.id ||
          v.option2 !== currentIteration.option2.id
      ),
      {
        option1: currentIteration.option1.id,
        option2: currentIteration.option2.id,
        value: val,
      },
    ];

    onChange(_newValue, {}, false);
  };
  const _onClickNextIteration = async () => {
    const _next = iteration + 1;
    const _isTheLastOne =
      (iterationsToRepeat.length &&
        iterationsToRepeat.findIndex((i) => i === iteration) ===
          iterationsToRepeat.length - 1) ||
      _next === optionsMatrix.length;

    if (_isTheLastOne) {
      const egeinVectorData = await calcEigenVector(options, value, meta, {
        correlationLimitValue,
      });
      const metaEndTime = getQuestionEndTime(meta);

      const _meta = { ...metaEndTime, ...egeinVectorData };
      const _newValue = [
        ...value.filter(filterIterationsWithValue),
        {
          key: "eigenVector",
          value: egeinVectorData.eigenVector,
        },
      ];
      onChange(_newValue, _meta);

      setIteration(-1);
      return;
    }

    if (iterationsToRepeat.length && iterationsToRepeat.includes(iteration)) {
      const _currentIndex = iterationsToRepeat.findIndex(
        (i) => i === iteration
      );

      setIteration(iterationsToRepeat[_currentIndex + 1]);
      return;
    }
    setIteration(_next);
  };
  const _onRepeatQuestion = () => {
    const { valuesByColumn, comparisionsMatrix, hasValidR2, isValid } = meta;

    if (!comparisionsMatrix || hasValidR2 || isValid) {
      setIteration(0);
      setIterationsToRepeat([]);
      return;
    }
    let max = [0, 0];
    let maxCoord = [];
    const colsIds = Object.keys(valuesByColumn);
    const rowsValues = Object.values(valuesByColumn);

    for (let colIndex = 0; colIndex < comparisionsMatrix.length; colIndex++) {
      const col = comparisionsMatrix[colIndex];

      for (let rowIndex = 0; rowIndex < col.length; rowIndex++) {
        const value = col[rowIndex];
        const rowIds = Object.keys(rowsValues[rowIndex]);

        if (value > max[0]) {
          max[0] = value;
          maxCoord[0] = [colsIds[colIndex], rowIds[rowIndex]];
        } else if (value > max[1] && max[1] < max[0]) {
          if (
            maxCoord[0] &&
            maxCoord[0][0] !== colsIds[colIndex] &&
            maxCoord[0][0] !== rowIds[rowIndex]
          ) {
            max[1] = value;
            maxCoord[1] = [colsIds[colIndex], rowIds[rowIndex]];
          }
        }
      }
    }

    const _isOptionsEqual = (a, b) => isEqual(String(a), String(b));
    let toRepeat = maxCoord.reduce((acc, cur) => {
      return [
        ...acc,
        value.findIndex(
          (o) =>
            (_isOptionsEqual(o.option1, cur[0]) &&
              _isOptionsEqual(o.option2, cur[1])) ||
            (_isOptionsEqual(o.option2, cur[0]) &&
              _isOptionsEqual(o.option1, cur[1]))
        ),
      ];
    }, []);

    // if to repeat is empty, then we need to repeat all the questions again
    if (!toRepeat.length) {
      toRepeat = value.map((o, i) => i);
    }

    setIterationsToRepeat(toRepeat);
  };
  const _renderOption = (option) => {
    if (renderOptionInfo) return renderOptionInfo(option);

    return option?.title;
  };
  const isOnLastIteration = iteration === -1;

  if (isOnLastIteration)
    return (
      <>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <br />
              <b>
                <Header size="medium">
                  {meta?.isValid ? (
                    t("Completo")
                  ) : (
                    <>
                      <strong style={{ color: "darkred" }}>
                        {t(
                          "As suas respostas têm problemas de transitividade. Para resolver, reconsidere as seguintes respostas."
                        )}
                      </strong>
                    </>
                  )}
                </Header>
              </b>
            </Grid.Column>
          </Grid.Row>

          {(allowUserRepeatQuestion || !meta?.isValid) && (
            <Grid.Row>
              <Grid.Column width={16}>
                <Button onClick={_onRepeatQuestion} floated="left">
                  {t("Voltar a Preencher")}
                </Button>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </>
    );
  if (!currentIteration) return "";

  const _computerButtons = (
    <>
      <Grid.Column mobile={16} tablet={8} computer={8}>
        <strong>
          {t("comparação")} {iteration + 1} {t("de")} {optionsMatrix.length}
        </strong>
      </Grid.Column>
      <Grid.Column floated="right" mobile={16} tablet={8} computer={8}>
        <Button
          disabled={
            currentIteratonValue === undefined ||
            currentIteratonValue === false ||
            currentIteratonValue === null
          }
          onClick={_onClickNextIteration}
          floated="right"
        >
          {t("Seguinte")}
        </Button>
        {showPreviousIteration && (
          <Button
            disabled={iteration === 0}
            onClick={() =>
              setIteration(
                iteration === 0 ? optionsMatrix.length - 1 : iteration - 1
              )
            }
            floated="right"
          >
            {t("Anterior")}
          </Button>
        )}
      </Grid.Column>
    </>
  );
  const _mobileButtons = (
    <>
      <CenteredColumn width={16}>
        <strong>
          {t("comparação")} {iteration + 1} {t("de")} {optionsMatrix.length}
        </strong>
      </CenteredColumn>
      <CenteredColumn width={16}>
        <div>
          {showPreviousIteration && (
            <Button
              disabled={iteration === 0}
              onClick={() =>
                setIteration(
                  iteration === 0 ? optionsMatrix.length - 1 : iteration - 1
                )
              }
            >
              {t("Anterior")}
            </Button>
          )}
          <Button
            disabled={currentIteratonValue === undefined}
            onClick={_onClickNextIteration}
          >
            {t("Seguinte")}
          </Button>
        </div>
      </CenteredColumn>
    </>
  );
  const _mobileBalance = (
    <>
      <Grid.Column mobile={12}>
        <Grid style={{ height: styleProps.mobileOptionsHeight || 200 }}>
          <Grid.Row>
            <Grid.Column width={16}>
              <QuestionOptionTitle style={{ justifyContent: "right" }}>
                {_renderOption(currentIteration?.option1)}
              </QuestionOptionTitle>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <QuestionOptionTitle
                style={{
                  height: "100%",
                  alignItems: "end",
                  justifyContent: "right",
                }}
              >
                {_renderOption(currentIteration?.option2)}
              </QuestionOptionTitle>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
      <Grid.Column mobile={4}>
        <Balance
          value={currentIteratonValue}
          onChange={_onIterationValueChange}
          disabled={disabled}
          showBalance={showBalance}
          height={styleProps.mobileBalanceHeight || 200}
        />
      </Grid.Column>
    </>
  );
  const _computerBalance = (
    <>
      <Grid.Column mobile={2} tablet={5} computer={5}>
        <QuestionOptionTitle>
          {_renderOption(currentIteration?.option1)}
        </QuestionOptionTitle>
      </Grid.Column>
      <Grid.Column mobile={12} tablet={6} computer={6}>
        <Balance
          value={currentIteratonValue}
          onChange={_onIterationValueChange}
          disabled={disabled}
          showBalance={showBalance}
        />
      </Grid.Column>
      <Grid.Column mobile={2} tablet={5} computer={5}>
        <QuestionOptionTitle>
          {_renderOption(currentIteration?.option2)}
        </QuestionOptionTitle>
      </Grid.Column>
    </>
  );

  return (
    <Wrapper>
      <Grid verticalAlign="middle">
        <Grid.Row stretched only="tablet computer large">
          {_computerBalance}
        </Grid.Row>
        <Grid.Row stretched only="mobile">
          {_mobileBalance}
        </Grid.Row>
        <Grid.Row only="tablet computer large">{_computerButtons}</Grid.Row>
        <Grid.Row only="mobile">{_mobileButtons}</Grid.Row>
      </Grid>
    </Wrapper>
  );
};

export default WeightPairwiseCombinations;

const Wrapper = styled.div``;

const QuestionOptionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenteredColumn = styled(Grid.Column)`
  &&&& {
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
`;

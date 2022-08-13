/* eslint-disable import/no-anonymous-default-export */
import React from "react";

const generateNewIterationStack = (
  selectedImage,
  key,
  parentStackKey,
  stack
) => ({
  selectedImage: stack[Math.floor(Math.random() * stack.length)],
  better: [],
  worst: [],
  stack,
  key,
  parentStackKey,
});

const generateNewIteration = (stacks, key) => {
  return {
    stacks,
    key,
  };
};

const sortIntermediateOrder = (state) => {
  const {
    currentIterationIndex,
    currentIterationStackIndex,
    iterations,
    intermediateOrder,
  } = state;
  const currentIteration = iterations[currentIterationIndex];
  const currentIterationStack =
    currentIteration && currentIteration.stacks[currentIterationStackIndex];

  const completed =
    iterations.length > 1 && currentIteration
      ? currentIteration.stacks.length === 0
      : state.completed;

  console.log({ completed, state });

  if (!currentIterationStack) return { ...state, completed };

  let currentStackOrder = [
    ...currentIterationStack.better,
    ...(currentIterationStack.selectedImage
      ? [currentIterationStack.selectedImage]
      : []),
    ...currentIterationStack.worst,
  ];

  let newIntermediateOrder = intermediateOrder;

  if (iterations.length > 1) {
    currentIterationStack.better.forEach((img) => {
      newIntermediateOrder.splice(
        newIntermediateOrder.findIndex((el) => el === img),
        1
      );
      newIntermediateOrder.splice(
        newIntermediateOrder.findIndex(
          (el) => el === currentIterationStack.selectedImage
        ),
        0,
        img
      );
    });
    currentIterationStack.worst.forEach((img) => {
      newIntermediateOrder.splice(
        newIntermediateOrder.findIndex((el) => el === img),
        1
      );
      newIntermediateOrder.splice(
        newIntermediateOrder.findIndex(
          (el) => el === currentIterationStack.selectedImage
        ) + 1,
        0,
        img
      );
    });
  } else {
    newIntermediateOrder = currentStackOrder;
  }

  return {
    ...state,
    intermediateOrder: newIntermediateOrder,
    completed,
  };
};

const initialState = {
  intermediateOrder: [],
  currentIterationIndex: 0,
  currentIterationStackIndex: null,
  iterations: [],
};

export default (defaultState) => {
  function reducer(state, action) {
    switch (action.type) {
      case "resetState": {
        return {
          ...initialState,
          ...action.payload,
        };
      }
      case "setItermediateOrder": {
        return {
          ...state,
          intermediateOrder: action.payload.intermediateOrder,
        };
      }
      case "setCurrentIterationStackIndex": {
        return {
          ...state,
          currentIterationStackIndex: action.payload.index,
        };
      }
      case "startNewIteration": {
        const { stacks, key } = action.payload;
        const { iterations } = state;

        const nextState = sortIntermediateOrder({
          ...state,
          currentIterationIndex: iterations.length,
          currentIterationStackIndex: 0,
          iterations: [...iterations, generateNewIteration(stacks, key)],
        });

        return {
          ...nextState,
        };
      }
      case "addNewIterationStack": {
        const { stack } = action.payload;
        const { iterations, currentIterationIndex } = state;
        const currentIteration = iterations[currentIterationIndex];
        const newIterations = [...iterations].filter(
          (i) => i.key !== currentIteration.key
        );
        const newStacks = [...currentIteration.stacks, stack];

        newIterations.splice(currentIterationIndex, 0, {
          ...currentIteration,
          stacks: newStacks,
        });

        return sortIntermediateOrder({
          ...state,
          currentIterationStackIndex: newStacks.length - 1,
          iterations: newIterations,
        });
      }
      case "addImageAsBetter": {
        const {
          currentIterationIndex,
          currentIterationStackIndex,
          iterations,
        } = state;
        const { image } = action.payload;
        const currentIteration = iterations[currentIterationIndex];
        const currentIterationStack =
          currentIteration &&
          currentIteration.stacks[currentIterationStackIndex];
        const newIterations = [...iterations].filter(
          (i) => i.key !== currentIteration.key
        );
        const newStacks = [...currentIteration.stacks].filter(
          (i) => i.key !== currentIterationStack.key
        );

        newStacks.splice(currentIterationStackIndex, 0, {
          ...currentIterationStack,
          better: [...currentIterationStack.better, image],
        });
        newIterations.splice(currentIterationIndex, 0, {
          ...currentIteration,
          stacks: newStacks,
        });

        return sortIntermediateOrder({
          ...state,
          iterations: newIterations,
        });
      }
      case "addImageAsWorst": {
        const {
          currentIterationIndex,
          currentIterationStackIndex,
          iterations,
        } = state;
        const { image } = action.payload;
        const currentIteration = iterations[currentIterationIndex];
        const currentIterationStack =
          currentIteration &&
          currentIteration.stacks[currentIterationStackIndex];
        const newIterations = [...iterations].filter(
          (i) => i.key !== currentIteration.key
        );
        const newStacks = [...currentIteration.stacks].filter(
          (i) => i.key !== currentIterationStack.key
        );

        newStacks.splice(currentIterationStackIndex, 0, {
          ...currentIterationStack,
          worst: [...currentIterationStack.worst, image],
        });
        newIterations.splice(currentIterationIndex, 0, {
          ...currentIteration,
          stacks: newStacks,
        });

        return sortIntermediateOrder({
          ...state,
          iterations: newIterations,
        });
      }
      default:
        throw new Error();
    }
  }
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    ...(defaultState || {}),
  });

  const setItermediateOrder = (intermediateOrder) =>
    dispatch({
      type: "setItermediateOrder",
      payload: { intermediateOrder },
    });
  const selectImageAsBetter = (image) => {
    dispatch({
      type: "addImageAsBetter",
      payload: { image },
    });
  };
  const selectImageAsWorst = (image) => {
    dispatch({
      type: "addImageAsWorst",
      payload: { image },
    });
  };
  const startNewIteration = (key) => {
    const currentIteration = state.iterations[state.currentIterationIndex];

    const stacks = !currentIteration
      ? []
      : currentIteration.stacks.reduce((acc, cur) => {
          const newStacks = [];

          if (cur.better.length > 1) {
            newStacks.push(
              generateNewIterationStack(
                null,
                `${currentIteration.key}.${cur.key}.+`,
                cur.key,
                cur.better
              )
            );
          }
          if (cur.worst.length > 1) {
            newStacks.push(
              generateNewIterationStack(
                null,
                `${currentIteration.key}.${cur.key}.-`,
                cur.key,
                cur.worst
              )
            );
          }

          return [...acc, ...newStacks];
        }, []);

    dispatch({
      type: "startNewIteration",
      payload: { stacks, key },
    });
  };
  const startNewIterationStack = (key, stack) => {
    const newStack = generateNewIterationStack(null, key, null, stack);

    dispatch({
      type: "addNewIterationStack",
      payload: { stack: newStack },
    });
  };
  const setCurrentIterationStackIndex = (index) => {
    dispatch({
      type: "setCurrentIterationStackIndex",
      payload: { index },
    });
  };
  const resetState = (state) => {
    dispatch({
      type: "resetState",
      payload: state,
    });
  };

  React.useEffect(() => {
    if (!defaultState) return;
    if (!!state) return;

    console.log("apply default state");
    resetState(defaultState);
  }, [!defaultState]);

  return [
    state,
    {
      setItermediateOrder,
      selectImageAsBetter,
      selectImageAsWorst,
      startNewIteration,
      startNewIterationStack,
      setCurrentIterationStackIndex,
      resetState,
    },
  ];
};

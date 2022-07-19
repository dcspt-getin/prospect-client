import React from "react";
import styled from "styled-components";

const IterationsDebugger = ({
  iterations,
  intermediateOrder,
  image1,
  image2,
  currentIterationStack,
}) => {
  return (
    <div>
      <DebugContainer>
        {intermediateOrder.map((imageKey) => (
          <DebugImageContainer
            comparing={[image1, image2].includes(imageKey)}
            selected={
              currentIterationStack &&
              currentIterationStack.selectedImage === imageKey
            }
            better={
              currentIterationStack &&
              currentIterationStack.better.includes(imageKey)
            }
            worst={
              currentIterationStack &&
              currentIterationStack.worst.includes(imageKey)
            }
          >
            <span>{imageKey}</span>
            {/* <Image src={images[imageKey]} size="small" /> */}
          </DebugImageContainer>
        ))}
      </DebugContainer>

      {iterations.map((iteration) => (
        <>
          {iteration.stacks.map((iterationStack) => (
            <DebugContainer
              style={{
                ...(currentIterationStack &&
                iterationStack.key === currentIterationStack.key
                  ? { border: "1px solid red" }
                  : {}),
              }}
            >
              <span>{iterationStack.key}</span>
              {iterationStack.stack.map((imageKey) => (
                <DebugImageContainer
                  comparing={[image1, image2].includes(imageKey)}
                  selected={iterationStack.selectedImage === imageKey}
                  better={iterationStack.better.includes(imageKey)}
                  worst={iterationStack.worst.includes(imageKey)}
                >
                  <span>{imageKey}</span>
                  {/* <Image src={images[imageKey]} size="small" /> */}
                </DebugImageContainer>
              ))}
            </DebugContainer>
          ))}
        </>
      ))}
    </div>
  );
};

export default IterationsDebugger;

const DebugContainer = styled.div`
  display: flex;
  margin-top: 70px;
`;

const DebugImageContainer = styled.div`
  margin: 5px 5px;
  position: relative;
  width: 50px;
  height: 50px;

  span {
    position: absolute;
    z-index: 1;
  }

  &:after {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.6;
    width: 100%;
    height: 100%;

    ${({ comparing }) =>
      comparing &&
      `
      content: '';
      background: yellow;
    `}
    ${({ better }) =>
      better &&
      `
      content: '';
      background: green;
    `}
    ${({ worst }) =>
      worst &&
      `
      content: '';
      background: red;
    `}
    ${({ selected }) =>
      selected &&
      `
      content: '';
      background: blue;
    `}
  }

  img {
    width: 80px !important;
  }
`;

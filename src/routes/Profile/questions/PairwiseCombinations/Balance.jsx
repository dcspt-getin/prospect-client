/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import styled from "styled-components";
import { Slider } from "react-semantic-ui-range";
import { Grid } from "semantic-ui-react";

const _convertValueFromSlider = (value) => value - 3;
const _convertValueToSlider = (value) => value + 3;
const _convertValueToSliderLabel = (value) => (value > 0 ? value : value * -1);

export default (props) => {
  const [value, setValue] = React.useState(
    _convertValueToSlider(props.value || 0)
  );

  React.useEffect(() => {
    setValue(_convertValueToSlider(props.value || 0));
  }, [props.value]);

  const maxAngle = 10;
  const angle = (value * maxAngle) / 6;

  const x = Math.max(-maxAngle, Math.min(maxAngle, angle)) - 5;
  const left = (value * 100) / 6;

  return (
    <Wrapper>
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <BalanceContainer>
              <div id="roberval">
                <div id="balance" style={{ transform: `rotate(${x}deg)` }}>
                  <div
                    id="ball"
                    style={{
                      left: `${left}%`,
                    }}
                  >
                    {_convertValueToSliderLabel(_convertValueFromSlider(value))}
                  </div>
                  <div id="bar"></div>
                </div>
                <div id="base"></div>
              </div>
            </BalanceContainer>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <SliderContainer>
              <Slider
                value={value}
                discrete
                settings={{
                  start: 0,
                  min: 0,
                  max: 6,
                  step: 1,
                  onChange: (_val) => {
                    setValue(_val);
                    if (props.onChange)
                      props.onChange(_convertValueFromSlider(_val));
                  },
                }}
              />
            </SliderContainer>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 22px 0;
`;

const BalanceContainer = styled.div`
  #values {
    display: flex;
    justify-content: space-between;
  }
  #ball {
    width: 36px;
    height: 36px;
    background: maroon;
    position: absolute;
    left: 0;
    bottom: 9px;
    border-radius: 50%;
    transform: translate(-50%, 0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  }
  #bar {
    border: 0.2rem solid maroon;
    background: maroon;
    height: 8px;
    margin-bottom: 1px;
    border-radius: 3px;
  }
  #roberval {
    width: 100%;
    /* max-width: 20rem; */
    margin: 0;
    font-size: 1rem;
    padding: 0 10px;
    margin-top: 36px;
  }
  #base {
    width: 0;
    height: 0;
    border-left: 2rem solid transparent;
    border-right: 2rem solid transparent;
    border-bottom: 2rem solid maroon;
    margin: auto;
  }
`;

const SliderContainer = styled.div`
  .semantic_ui_range_inner {
    div:nth-child(2) {
      background-color: transparent !important;
    }
  }
`;

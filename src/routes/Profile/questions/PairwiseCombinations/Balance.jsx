/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import styled from "styled-components";
import { Grid } from "semantic-ui-react";
import MuiSlider from "@material-ui/core/Slider";

const _convertValueFromSlider = (value) => value - 3;
const _convertValueToSlider = (value) => value + 3;
const _convertValueToSliderLabel = (value) => (value > 0 ? value : value * -1);

export default (props) => {
  const [value, setValue] = React.useState(
    _convertValueToSlider(props.value || 0)
  );
  const balanceRef = React.useRef(null);

  React.useEffect(() => {
    setValue(_convertValueToSlider(props.value || 0));
  }, [props.value]);

  const maxAngle = 10;
  const angle = (value * maxAngle) / 6;

  const x = Math.max(-maxAngle, Math.min(maxAngle, angle)) - 5;
  const left = (value * 100) / 6;

  const _onSliderChange = (_val, e) => {
    setValue(_val);
    if (props.onChange) props.onChange(_convertValueFromSlider(_val));
  };
  const _onBalanceClick = (e) => {
    const rect = balanceRef.current.getBoundingClientRect();

    const {
      target: { clientWidth },
      pageX,
    } = e;
    const start = rect.left;
    const screenX = pageX - start;

    const parcel = Math.round(clientWidth / 6);
    let val = Math.round(screenX / parcel);

    if (val > 6) val = 6;
    if (val < 0) val = 0;

    setValue(val);
  };

  return (
    <Wrapper>
      <Grid>
        <Grid.Row only="tablet computer">
          <Grid.Column width={16}>
            <Grid.Row>
              <Grid.Column width={16}>
                <BalanceContainer>
                  <div id="roberval" ref={balanceRef} onClick={_onBalanceClick}>
                    <div id="balance" style={{ transform: `rotate(${x}deg)` }}>
                      <div
                        id="ball"
                        style={{
                          left: `${left}%`,
                        }}
                      >
                        {_convertValueToSliderLabel(
                          _convertValueFromSlider(value)
                        )}
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
                  <HorizSlider
                    color="primary"
                    value={value}
                    min={0}
                    max={6}
                    step={1}
                    onChange={(e, val) => _onSliderChange(val, e)}
                  />
                </SliderContainer>
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only="mobile">
          <Grid.Column width={16} style={{ height: 200 }}>
            <VerticalSlider
              orientation="vertical"
              color="primary"
              value={value}
              min={0}
              max={6}
              step={1}
              onChange={(e, val) => _onSliderChange(val, e)}
              valueLabelDisplay="on"
              valueLabelFormat={(v) =>
                _convertValueToSliderLabel(_convertValueFromSlider(v))
              }
            />
            {/* 
            Sample vertical slider:
              - https://codesandbox.io/s/material-demo-60upy?fontsize=14&hidenavigation=1&theme=dark&file=/src/App.js:1395-1419
            */}
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
    bottom: 11px;
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
    height: 10px;
    margin-bottom: 1px;
    border-radius: 3px;
  }
  #roberval {
    width: 100%;
    /* max-width: 20rem; */
    margin: 0;
    font-size: 1rem;
    padding: 0 10px;
    padding-top: 36px;
    cursor: pointer;
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
  margin-top: 10px;

  .semantic_ui_range_inner {
    div:nth-child(2) {
      background-color: transparent !important;
    }
  }
`;

const HorizSlider = styled(MuiSlider)`
  &&& {
    .MuiSlider-track {
      display: none;
    }

    .MuiSlider-thumb {
      width: 16px;
      height: 16px;
      margin-top: -8px;
      margin-left: -8px;
    }
  }
`;

const VerticalSlider = styled(MuiSlider)`
  &&& {
    .MuiSlider-track {
      display: none;
    }

    .MuiSlider-thumb > span {
      transform: rotate(90deg);
      margin-left: 16px;
      margin-top: 8px;

      > span > span {
        transform: rotate(-45deg);
      }
    }
  }
`;

/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Table, Select } from "semantic-ui-react";
import styled from "styled-components";

export default ({ columns, rows, options, value, handleChange, hide }) => {
  if (hide) return "";

  const _handleSelectChange =
    (id) =>
    (e, { value: selectValue }) => {
      const newValue = {
        ...value,
        [id]: selectValue,
      };

      handleChange(e, { value: newValue });
    };
  return (
    <ResponsiveTable celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell></Table.HeaderCell>
          {columns.map((col) => (
            <Table.HeaderCell style={{ width: col.width || 150 }}>
              {col.title}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {rows.map((row, rowIndex) => (
          <Table.Row>
            <Table.Cell>
              <label style={{ minWidth: "70px", display: "block" }}>
                {row.title}
              </label>
            </Table.Cell>
            {columns.map((col) => (
              <Table.Cell>
                <Select
                  fluid
                  style={{ width: col.width || 150 }}
                  placeholder="Select"
                  options={options[col.id] || []}
                  value={value && value[`${rowIndex}_${col.id}`]}
                  onChange={_handleSelectChange(`${rowIndex}_${col.id}`)}
                />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </ResponsiveTable>
  );
};

const ResponsiveTable = styled(Table)`
  &&&& {
    @media only screen and (max-width: 992px) {
      tr td,
      tr th {
        width: auto !important;
        display: block !important;

        .ui.fluid.dropdown {
          width: 100% !important;
        }
      }
    }
  }
`;

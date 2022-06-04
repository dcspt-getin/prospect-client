/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, Form, Segment, Button, Input } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import styled from "styled-components";

import useTranslations from "hooks/useTranslations";
import { getAppConfiguration } from "store/app/selectors";
import QuestionInfo from "../_shared/QuestionInfo";

import FieldOptions from "./FieldOptions";
import FieldTable from "./FieldTable";

const QUESTIONS_OPTIONS = (t) => ({
  sexo: [
    { value: 1, text: t("QUESTION_1_OPTION_1") },
    { value: 2, text: t("QUESTION_1_OPTION_2") },
  ],
  idade: [
    { value: 1, text: t("QUESTION_2_OPTION_1") },
    { value: 2, text: t("QUESTION_2_OPTION_2") },
    { value: 3, text: t("QUESTION_2_OPTION_3") },
    { value: 4, text: t("QUESTION_2_OPTION_4") },
    { value: 5, text: t("QUESTION_2_OPTION_5") },
  ],
  estadoCivil: [
    { value: 1, text: t("QUESTION_3_OPTION_1") },
    { value: 2, text: t("QUESTION_3_OPTION_2") },
    { value: 3, text: t("QUESTION_3_OPTION_3") },
    { value: 4, text: t("QUESTION_3_OPTION_4") },
    { value: 5, text: t("QUESTION_3_OPTION_5") },
  ],
  escolaridade: [
    { value: 1, text: t("QUESTION_4_OPTION_1") },
    { value: 2, text: t("QUESTION_4_OPTION_2") },
    { value: 3, text: t("QUESTION_4_OPTION_3") },
    { value: 4, text: t("QUESTION_4_OPTION_4") },
    { value: 5, text: t("QUESTION_4_OPTION_5") },
    { value: 6, text: t("QUESTION_4_OPTION_6") },
    { value: 7, text: t("QUESTION_4_OPTION_7") },
  ],
  actividadePincipal: [
    { value: 1, text: t("QUESTION_5_OPTION_1") },
    {
      value: 2,
      text: t("QUESTION_5_OPTION_2"),
    },
    {
      value: 3,
      text: t("QUESTION_5_OPTION_3"),
    },
    { value: 4, text: t("QUESTION_5_OPTION_4") },
    { value: 5, text: t("QUESTION_5_OPTION_5") },
    { value: 6, text: t("QUESTION_5_OPTION_6") },
    { value: 7, text: t("QUESTION_5_OPTION_7"), textOption: true },
    { value: 8, text: t("QUESTION_5_OPTION_8") },
  ],
  situacaoProfissao: [
    { value: 1, text: t("QUESTION_6_OPTION_1") },
    { value: 2, text: t("QUESTION_6_OPTION_2") },
    { value: 3, text: t("QUESTION_6_OPTION_3") },
    { value: 4, text: t("QUESTION_6_OPTION_4"), textOption: true },
    { value: 5, text: t("QUESTION_6_OPTION_5") },
  ],
  profissao: [
    {
      value: 1,
      text: t("QUESTION_7_OPTION_1"),
    },
    {
      value: 2,
      text: t("QUESTION_7_OPTION_2"),
    },
    { value: 3, text: t("QUESTION_7_OPTION_3") },
    { value: 4, text: t("QUESTION_7_OPTION_4") },
    { value: 5, text: t("QUESTION_7_OPTION_5") },
    {
      value: 6,
      text: t("QUESTION_7_OPTION_6"),
    },
    { value: 7, text: t("QUESTION_7_OPTION_7") },
    {
      value: 8,
      text: t("QUESTION_7_OPTION_8"),
    },
    { value: 9, text: t("QUESTION_7_OPTION_9") },
    { value: 10, text: t("QUESTION_7_OPTION_10"), textOption: true },
    { value: 11, text: t("QUESTION_7_OPTION_11") },
  ],
  fontesRendimento: [
    { value: 1, text: t("QUESTION_10_OPTION_1") },
    { value: 2, text: t("QUESTION_10_OPTION_2") },
    {
      value: 3,
      text: t("QUESTION_10_OPTION_3"),
    },
    { value: 4, text: t("QUESTION_10_OPTION_4"), textOption: true },
  ],
  principalFonteRendimento: [
    { value: 1, text: t("QUESTION_11_OPTION_1") },
    { value: 2, text: t("QUESTION_11_OPTION_2") },
    { value: 3, text: t("QUESTION_11_OPTION_3") },
    { value: 4, text: t("QUESTION_11_OPTION_4"), textOption: true },
  ],
  nivelRendimento: [
    { value: 1, text: t("QUESTION_12_OPTION_1") },
    { value: 2, text: t("QUESTION_12_OPTION_2") },
    { value: 3, text: t("QUESTION_12_OPTION_3") },
    { value: 4, text: t("QUESTION_12_OPTION_4") },
    { value: 5, text: t("QUESTION_12_OPTION_5") },
    { value: 6, text: t("QUESTION_12_OPTION_6") },
    { value: 7, text: t("QUESTION_12_OPTION_7") },
    { value: 8, text: t("QUESTION_12_OPTION_8") },
  ],
  agregado: [
    { value: 1, text: t("QUESTION_AGREGADO_OPTION_1") },
    { value: 2, text: t("QUESTION_AGREGADO_OPTION_2") },
    { value: 3, text: t("QUESTION_AGREGADO_OPTION_3") },
    { value: 4, text: t("QUESTION_AGREGADO_OPTION_4") },
    { value: 5, text: t("QUESTION_AGREGADO_OPTION_5") },
    { value: 6, text: t("QUESTION_AGREGADO_OPTION_6") },
    { value: 7, text: t("QUESTION_AGREGADO_OPTION_7") },
    { value: 8, text: t("QUESTION_AGREGADO_OPTION_8") },
  ],
  ocupacaoProfissional: [
    { value: 1, text: t("QUESTION_13_OPTION_1") },
    { value: 2, text: t("QUESTION_13_OPTION_2"), textOption: true },
    { value: 3, text: t("QUESTION_13_OPTION_3") },
    {
      value: 4,
      text: t("QUESTION_13_OPTION_4"),
    },
    { value: 5, text: t("QUESTION_13_OPTION_5") },
    { value: 6, text: t("QUESTION_13_OPTION_6"), textOption: true },
  ],
  deslocacaoUnidade: [
    { value: 1, text: t("QUESTION_14_OPTION_1") },
    { value: 2, text: t("QUESTION_14_OPTION_2") },
    { value: 3, text: t("QUESTION_14_OPTION_3") },
    { value: 6, text: t("QUESTION_14_OPTION_4"), textOption: true },
  ],
  frequenciaUtilizacaoCuidadosSaude: [
    { value: 1, text: t("QUESTION_15_OPTION_1") },
    { value: 2, text: t("QUESTION_15_OPTION_2") },
    { value: 3, text: t("QUESTION_15_OPTION_3") },
    { value: 4, text: t("QUESTION_15_OPTION_4") },
    { value: 5, text: t("QUESTION_15_OPTION_5") },
  ],
});

const Question = ({
  renderQuestion,
  label,
  index,
  questionKey,
  orderKey,
  ...props
}) => {
  const showQuestionsKeys = useSelector(
    (state) =>
      getAppConfiguration(state, "PROFILE_QUESTIONS_SHOW_KEYS") === "true"
  );

  const questionLabel = `${
    showQuestionsKeys ? `(${orderKey})` : ""
  } ${index}. ${label}`;

  return renderQuestion(questionLabel, { ...props, key: questionKey });
};

export default ({ question, onChange, value }) => {
  const [t] = useTranslations("userProfile");
  const dispatch = useDispatch();
  const [submited, setSubmited] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [formData, setFormData] = React.useState(value || {});
  const currentUser = useSelector((state) => state && state.auth.currentUser);
  const { permissions } = currentUser;
  const questionsOrder = useSelector((state) =>
    getAppConfiguration(state, "GROUP_PROFILE_QUESTIONS_ORDER")
  );
  let questionsOrderJSON;
  const options = QUESTIONS_OPTIONS(t);

  try {
    questionsOrderJSON = JSON.parse(questionsOrder);
  } catch (e) {}

  const groupQuestionsOrder =
    questionsOrderJSON && currentUser.groups.length
      ? (questionsOrderJSON[currentUser.groups[0].id] || []).map(String)
      : [];

  const debouncedUpdateProfile = useDebouncedCallback(
    // function
    (data) => {
      onChange(data);
    },
    // delay in ms
    500
  );

  const _handleOptionChange =
    (field) =>
    async (e, { value }) => {
      const newFormData = {
        ...formData,
        [field]: value,
      };
      setFormData(newFormData);
      debouncedUpdateProfile(newFormData);
    };
  const _handleTextChange =
    (field) =>
    ({ target }) => {
      setFormData({
        ...formData,
        [field]: target.value,
      });
    };
  const _handleTextBlur = () => {
    onChange(formData);
  };

  const _hasPermissionForQuestion = (permission) => {
    return true;

    // return permissions
    //   .map((p) => p.replace("housearch.", ""))
    //   .includes(permission);
  };

  const allQuestions = [
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
        />
      ),
      key: "sexo",
      label: t("QUESTION_1_TITLE"),
      orderKey: "1",
      visible: _hasPermissionForQuestion("general_profile_question_1"),
    },
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
        />
      ),
      key: "idade",
      label: t("QUESTION_2_TITLE"),
      orderKey: "2",
      visible: _hasPermissionForQuestion("general_profile_question_2"),
    },
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
        />
      ),
      key: "estadoCivil",
      label: t("QUESTION_3_TITLE"),
      orderKey: "3",
      visible: _hasPermissionForQuestion("general_profile_question_3"),
    },
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
        />
      ),
      key: "escolaridade",
      label: t("QUESTION_4_TITLE"),
      orderKey: "4",
      visible: _hasPermissionForQuestion("general_profile_question_4"),
    },
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
          textValue={formData.actividadePincipalText}
          handleTextChange={_handleTextChange("actividadePincipalText")}
          handleTextBlur={_handleTextBlur}
        />
      ),
      key: "actividadePincipal",
      label: t("QUESTION_5_TITLE"),
      orderKey: "5",
      visible: _hasPermissionForQuestion("general_profile_question_5"),
    },
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
          textValue={formData.situacaoProfissaoText}
          handleTextChange={_handleTextChange("situacaoProfissaoText")}
          handleTextBlur={_handleTextBlur}
        />
      ),
      key: "situacaoProfissao",
      label: t("QUESTION_6_TITLE"),
      orderKey: "6",
      visible: _hasPermissionForQuestion("general_profile_question_6"),
    },
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
          textValue={formData.profissaoText}
          handleTextChange={_handleTextChange("profissaoText")}
          handleTextBlur={_handleTextBlur}
        />
      ),
      key: "profissao",
      label: t("QUESTION_7_TITLE"),
      orderKey: "7",
      visible: _hasPermissionForQuestion("general_profile_question_7"),
    },
    {
      renderQuestion: (label, { key }) => (
        <Form.Field inline error={submited && !formData[key]}>
          <label>{label}</label>
          <Input value={formData[key]} onChange={_handleOptionChange(key)} />
        </Form.Field>
      ),
      key: "numResidentes",
      label: t("QUESTION_8_TITLE"),
      orderKey: "8",
      visible: _hasPermissionForQuestion("general_profile_question_8"),
    },
    {
      renderQuestion: (label, { key }) => (
        <Form.Field inline>
          <label>{label}</label>
          <FieldTable
            columns={[
              { id: "sexo", title: t("QUESTION_9_COLUMN_1_TITLE"), width: 70 },
              { id: "idade", title: t("QUESTION_9_COLUMN_2_TITLE"), width: 90 },
              {
                id: "agregado",
                title: t("QUESTION_9_COLUMN_3_TITLE"),
              },
              { id: "escolaridade", title: t("QUESTION_9_COLUMN_4_TITLE") },
              {
                id: "actividadePincipal",
                title: t("QUESTION_9_COLUMN_5_TITLE"),
              },
            ]}
            rows={[
              { title: t("QUESTION_9_ROW_1_TITLE") },
              { title: t("QUESTION_9_ROW_2_TITLE") },
              { title: t("QUESTION_9_ROW_3_TITLE") },
              { title: t("QUESTION_9_ROW_4_TITLE") },
              { title: t("QUESTION_9_ROW_5_TITLE") },
            ]}
            options={options}
            value={formData[key]}
            handleChange={_handleOptionChange(key)}
          />
        </Form.Field>
      ),
      key: "agregadoFamiliar",
      label: t("QUESTION_9_TITLE"),
      orderKey: "9",
      visible: _hasPermissionForQuestion("general_profile_question_9"),
    },
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
          textValue={formData.fontesRendimentoText}
          handleTextChange={_handleTextChange("fontesRendimentoText")}
          handleTextBlur={_handleTextBlur}
        />
      ),
      key: "fontesRendimento",
      label: t("QUESTION_10_TITLE"),
      orderKey: "10",
      visible: _hasPermissionForQuestion("general_profile_question_10"),
    },
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
          textValue={formData.principalFonteRendimentoText}
          handleTextChange={_handleTextChange("principalFonteRendimentoText")}
          handleTextBlur={_handleTextBlur}
        />
      ),
      key: "principalFonteRendimento",
      label: t("QUESTION_11_TITLE"),
      orderKey: "11",
      visible: _hasPermissionForQuestion("general_profile_question_11"),
    },
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
        />
      ),
      key: "nivelRendimento",
      label: t("QUESTION_12_TITLE"),
      orderKey: "12",
      visible: () => {
        const _visible = _hasPermissionForQuestion(
          "general_profile_question_12"
        );
        const _visibleQuestion13 = _hasPermissionForQuestion(
          "general_profile_question_13"
        );

        if (_visibleQuestion13 && _visible) {
          // only should be visible if question 13 has the answaer as 6
          return formData.ocupacaoProfissional === 6;
        }

        return _visible;
      },
    },
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
          textValue={formData.ocupacaoProfissionalText}
          handleTextChange={_handleTextChange("ocupacaoProfissionalText")}
          handleTextBlur={_handleTextBlur}
        />
      ),
      key: "ocupacaoProfissional",
      label: t("QUESTION_13_TITLE"),
      orderKey: "13",
      visible: _hasPermissionForQuestion("general_profile_question_13"),
    },
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
          textValue={formData.deslocacaoUnidadeText}
          handleTextChange={_handleTextChange("deslocacaoUnidadeText")}
          handleTextBlur={_handleTextBlur}
        />
      ),
      key: "deslocacaoUnidade",
      label: t("QUESTION_14_TITLE"),
      orderKey: "14",
      visible: _hasPermissionForQuestion("general_profile_question_14"),
    },
    {
      renderQuestion: (label, { key }) => (
        <FieldOptions
          value={formData[key]}
          handleChange={_handleOptionChange(key)}
          label={label}
          options={options[key]}
          error={submited && !formData[key]}
        />
      ),
      key: "frequenciaUtilizacaoCuidadosSaude",
      label: t("QUESTION_15_TITLE"),
      orderKey: "15",
      visible: _hasPermissionForQuestion("general_profile_question_15"),
    },
    {
      renderQuestion: (label, { key }) => (
        <Form.Field inline error={submited && !formData[key]}>
          <label>{label}</label>
          <Input value={formData[key]} onChange={_handleOptionChange(key)} />
        </Form.Field>
      ),
      key: "localResidencia",
      label: t("QUESTION_16_TITLE"),
      orderKey: "16",
      visible: _hasPermissionForQuestion("general_profile_question_16"),
    },
  ];

  const visibleQuestions = allQuestions
    .filter((q) =>
      typeof q.visible === "function" ? q.visible() : !!q.visible
    )
    .sort((a, b) => {
      const indexA = groupQuestionsOrder.indexOf(a.orderKey);
      const indexB = groupQuestionsOrder.indexOf(b.orderKey);

      return (
        (indexA === -1) - (indexB === -1) ||
        +(indexA > indexB) ||
        -(indexA < indexB)
      );
    });

  return (
    <Wrapper>
      <QuestionInfo question={question} />
      <div className="p-4">
        <Form>
          {visibleQuestions.map((q, i) => (
            <Question index={i + 1} questionKey={q.key} {...q} />
          ))}
        </Form>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

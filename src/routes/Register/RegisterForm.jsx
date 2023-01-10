/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import validator from "validator";
import styled from "styled-components";
import Cookies from "js-cookie";

import { registerUser } from "store/auth/actions";
import useTranslations from "hooks/useTranslations";

import createAccountOffice from "./create-account-office.jpeg";

export default () => {
  const [t] = useTranslations("register");
  const [form, setForm] = React.useState({
    email: "",
  });
  const [errors, setErrors] = React.useState({});
  const dispatch = useDispatch();
  const history = useHistory();

  const _onChangeField =
    (field) =>
    ({ target }) => {
      setForm({
        ...form,
        [field]: target.value,
      });
    };
  const _onSubmit = async () => {
    let valid = {};

    if (!form.terms) valid["terms"] = "ERROR_ACCEPT_TERMS";
    if (!form.email && !validator.isEmail(form.email))
      valid["email"] = "ERROR_INVALID_EMAIL";
    if (!form.username) valid["username"] = "ERROR_INSERT_USERNAME";
    if (!form.password || !form.confirmPassword)
      valid["password"] = "ERROR_INSERT_PASSWORD";
    if (form.password !== form.confirmPassword)
      valid["password"] = "ERROR_INVALID_PASSWORDS";

    if (Cookies.get("cookieBanner") !== "true") {
      setErrors({
        global: t(
          "Aceite a politica de cookies para poder entrar na aplicação"
        ),
      });

      return;
    }

    if (!Object.keys(valid).length) {
      const [created, error] = await dispatch(registerUser(form));

      if (error) {
        setErrors(error);
      }

      if (created) history.push("/login");
    } else {
      setErrors(valid);
    }
  };

  const _renderErrors = (field) => {
    const error = errors[field];

    const _renderError = (e) => (
      <span className="text-xs text-red-700" style={{ display: "block" }}>
        {t(e)}
      </span>
    );

    if (!error) return "";

    if (Array.isArray(error)) {
      return error.map(_renderError);
    }

    return _renderError(error);
  };

  return (
    <Wrapper className="flex items-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-2xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          {/* <div className="md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className=" w-full h-full dark:hidden"
              style={{
                objectFit: "cover",
                objectPosition: "bottom",
                borderRight: "1px solid #f0eeee",
              }}
              src={createAccountOffice}
              alt="Office"
            />
          </div> */}
          <div
            style={{ width: "100%" }}
            className="flex items-center justify-center p-6 sm:p-12"
          >
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                {t("REGISTER_CRIAR_CONTA")}
              </h1>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400">
                  {t("Email")}
                </span>
                <input
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder=""
                  name="email-xyz"
                  value={form.email}
                  onChange={_onChangeField("email")}
                />
                {_renderErrors("email")}
              </label>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400">
                  {t("Nome de utilizador")}
                </span>
                <input
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder=""
                  name="username-xyz"
                  value={form.username}
                  onChange={_onChangeField("username")}
                />
                {_renderErrors("username")}
              </label>
              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">
                  {t("Password")}
                </span>
                <input
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder="***************"
                  type="password"
                  value={form.password}
                  onChange={_onChangeField("password")}
                />
                {_renderErrors("password")}
              </label>
              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">
                  {t("Confirmar Password")}
                </span>
                <input
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder="***************"
                  type="password"
                  value={form.confirmPassword}
                  onChange={_onChangeField("confirmPassword")}
                />
              </label>
              <div className="flex mt-6 text-sm">
                <label className="flex items-center dark:text-gray-400">
                  <input
                    type="checkbox"
                    className="text-purple-600 form-checkbox focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                    onChange={() =>
                      setForm({
                        ...form,
                        terms: !form.terms,
                      })
                    }
                  />
                  <span className="ml-2">
                    {t("Aceito os ")}
                    <a
                      className="underline"
                      href={`${process.env.PUBLIC_URL}/${t(
                        "TERMS_CONDITIONS_LINK"
                      )}`}
                      target="_blank"
                    >
                      {" "}
                      {t("termos e condições")}
                    </a>
                  </span>
                </label>
              </div>
              <div>{_renderErrors("terms")}</div>

              <a
                className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                onClick={_onSubmit}
              >
                {t("Registar Conta")}
              </a>
              <div>{_renderErrors("global")}</div>

              <hr className="my-8" />

              <p className="mt-4">
                <a
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  href={`${process.env.PUBLIC_URL}/login`}
                >
                  {t("Ja tem uma conta?")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 1.5rem 0 !important;
`;

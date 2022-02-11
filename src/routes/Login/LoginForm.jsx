/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { login } from "store/auth/actions";
import useTranslations from "hooks/useTranslations";
import loginOffice from "./pic_fundo_brc.png";

export default () => {
  const dispatch = useDispatch();
  const [t] = useTranslations("login");

  const [errors, setErrors] = React.useState({});
  const [form, _setForm] = React.useState({
    username: "",
    password: "",
  });
  const setForm = (newData) => _setForm({ ...form, ...newData });
  const _changeFormField = (field) => (e) => {
    setForm({ [field]: e.target.value });
  };
  const _doLogin = async () => {
    const [success, error] = await dispatch(login(form));

    if (!success) {
      if (error && error.detail && error.detail === "account_not_active") {
        setErrors({
          global: t("ERROR_ACCOUNT_NOT_ACTIVE"),
        });
        return;
      }
      setErrors({
        global: t("ERROR_INVALID_DATA"),
      });
    }
  };
  const _onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      _doLogin();
    }
  };

  return (
    <Wrapper ClassName="flex items-center p-6 bg-gray-50 dark:bg-gray-900">
      <div class="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div class="flex flex-col overflow-y-auto md:flex-row">
          <div class="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              class="w-full h-full dark:hidden"
              style={{
                objectFit: "scale-down",
                objectPosition: "bottom",
                borderRight: "1px solid #f0eeee",
              }}
              src={loginOffice}
              alt="Office"
            />
          </div>
          <div class="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div class="w-full">
              <h1 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                {t("LOGIN_TITLE")}
              </h1>
              <form>
                <label class="block text-sm">
                  <span class="text-gray-700 dark:text-gray-400">
                    {t("USERNAME_FIELD")}
                  </span>
                  <input
                    class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder=""
                    value={form.username}
                    onChange={_changeFormField("username")}
                    onKeyDown={_onKeyDown}
                  />
                </label>
                <label class="block mt-4 text-sm">
                  <span class="text-gray-700 dark:text-gray-400">
                    {t("PASSWORD_FIELD")}
                  </span>
                  <input
                    class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray 0 form-input"
                    placeholder="***************"
                    type="password"
                    value={form.password}
                    onChange={_changeFormField("password")}
                    onKeyDown={_onKeyDown}
                  />
                </label>

                <a
                  class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  onClick={_doLogin}
                  onChange={_changeFormField("username")}
                >
                  {t("LOGIN_BUTTON")}
                </a>
                {errors.global && (
                  <span class="text-xs text-red-700">{errors.global}</span>
                )}
              </form>

              <hr class="my-8" />

              {/* <p class="mt-4">
                <a class="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline" href="/forgot-password">
                  Forgot your password?
                </a>
              </p> */}
              <p class="mt-1">
                <a
                  class="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  href={`${process.env.PUBLIC_URL}/register`}
                >
                  {t("CREATE_NEW_ACCOUNT")}
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
  padding: 1.5rem;
`;

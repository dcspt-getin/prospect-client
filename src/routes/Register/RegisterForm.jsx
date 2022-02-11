/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import validator from "validator";

import { registerUser } from "store/auth/actions";
import useTranslations from "hooks/useTranslations";

import createAccountOffice from "./pic_fundo_brc.png";

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

    if (!form.terms) valid["terms"] = t("ERROR_ACCEPT_TERMS");
    if (!form.email && !validator.isEmail(form.email))
      valid["email"] = t("ERROR_INVALID_EMAIL");
    if (!form.username) valid["username"] = t("ERROR_INSERT_USERNAME");
    if (!form.password || !form.confirmPassword)
      valid["password"] = t("ERROR_INSERT_PASSWORD");
    if (form.password !== form.confirmPassword)
      valid["password"] = t("ERROR_INVALID_PASSWORDS");

    if (!Object.keys(valid).length) {
      const created = await dispatch(registerUser(form));

      if (created) history.push("/login");
    } else {
      setErrors(valid);
    }
  };

  return (
    <div class="flex items-center p-6 bg-gray-50 dark:bg-gray-900">
      <div class="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div class="flex flex-col overflow-y-auto md:flex-row">
          <div class="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              class=" w-full h-full dark:hidden"
              style={{
                objectFit: "scale-down",
                objectPosition: "bottom",
                borderRight: "1px solid #f0eeee",
              }}
              src={createAccountOffice}
              alt="Office"
            />
          </div>
          <div class="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div class="w-full">
              <h1 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                {t("REGISTER_TITLE")}
              </h1>
              <label class="block text-sm">
                <span class="text-gray-700 dark:text-gray-400">
                  {t("EMAIL_FIELD")}
                </span>
                <input
                  class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder=""
                  name="email-xyz"
                  value={form.email}
                  onChange={_onChangeField("email")}
                />
                {errors.email && (
                  <span class="text-xs text-red-700">{errors.email}</span>
                )}
              </label>
              <label class="block text-sm">
                <span class="text-gray-700 dark:text-gray-400">
                  {t("USERNAME_FIELD")}
                </span>
                <input
                  class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder=""
                  name="username-xyz"
                  value={form.username}
                  onChange={_onChangeField("username")}
                />
                {errors.username && (
                  <span class="text-xs text-red-700">{errors.username}</span>
                )}
              </label>
              <label class="block mt-4 text-sm">
                <span class="text-gray-700 dark:text-gray-400">
                  {t("PASSWORD_FIELD")}
                </span>
                <input
                  class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder="***************"
                  type="password"
                  value={form.password}
                  onChange={_onChangeField("password")}
                />
                {errors.password && (
                  <span class="text-xs text-red-700">{errors.password}</span>
                )}
              </label>
              <label class="block mt-4 text-sm">
                <span class="text-gray-700 dark:text-gray-400">
                  {t("CONFIRM_PASSWORD_FIELD")}
                </span>
                <input
                  class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder="***************"
                  type="password"
                  value={form.confirmPassword}
                  onChange={_onChangeField("confirmPassword")}
                />
              </label>
              <div class="flex mt-6 text-sm">
                <label class="flex items-center dark:text-gray-400">
                  <input
                    type="checkbox"
                    class="text-purple-600 form-checkbox focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                    onChange={() =>
                      setForm({
                        ...form,
                        terms: !form.terms,
                      })
                    }
                  />
                  <span class="ml-2">
                    {t("ACCEPT_TERMS_1")}
                    <a
                      class="underline"
                      href={`${process.env.PUBLIC_URL}/terms-conditions`}
                      target="_blank"
                    >
                      {" "}
                      {t("ACCEPT_TERMS_2")}
                    </a>
                  </span>
                </label>
              </div>
              <div>
                {errors.terms && (
                  <span class="text-xs text-red-700">{errors.terms}</span>
                )}
              </div>

              <a
                class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                onClick={_onSubmit}
              >
                {t("REGISTER_BUTTON")}
              </a>

              <hr class="my-8" />

              <p class="mt-4">
                <a
                  class="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  href={`${process.env.PUBLIC_URL}/login`}
                >
                  {t("ALREADY_HAVE_ACCOUNT_LINK")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

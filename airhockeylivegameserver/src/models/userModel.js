import pool from "../config/db.js";
import { isUserAlreadyOnline } from "../Services/realTimeServices/realTimeServices.js";

export const createUser = async (username, password, registerotp) => {
  const result = await pool.query(
    "INSERT INTO users (username, password, register_otp) VALUES ($1, $2, $3) RETURNING id, username",
    [username, password, registerotp]
  );
  return result.rows[0];
};

export const findUserByUsername = async (username) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};

export const setPasswordResetOtpByUsername = async (username, otp) => {
  const result = await pool.query(
    "Update users set forgot_password_otp = $1 WHERE username = $2",
    [otp, username]
  );
  return result.rows[0];
};

export const setRegisterOtpByUsername = async (username, otp) => {
  const result = await pool.query(
    "Update users set register_otp = $1 WHERE username = $2",
    [otp, username]
  );
  return result.rows[0];
};

export const updateNewPasswordByUserName = async (username, password) => {
  const result = await pool.query(
    "Update users set password = $1 WHERE username = $2",
    [password, username]
  );
  return result.rows[0];
};

export const setUserAsRegistered = async (username) => {
  const result = await pool.query(
    "Update users set user_registered = true WHERE username = $1",
    [username]
  );
  return result.rows[0];
};

export const deleteUser = async (username) => {
  const result = await pool.query("Delete from users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};

export const userPresent = async (username) => {
  return isUserAlreadyOnline(username);
};

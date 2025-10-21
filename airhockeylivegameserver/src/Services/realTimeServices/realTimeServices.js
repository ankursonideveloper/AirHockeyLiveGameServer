import pool from "../../config/db.js";

export const addPlayerInAvailablePlayers = async (useremail, socketid) => {
  try {
    const result = await pool.query(
      "Insert into available_players(user_email, socketid) values($1, $2) returning id, username",
      [useremail, socketid]
    );
    return result.rows[0];
  } catch (e) {
    console.log(`Erron in addPlayerInAvailablePlayers: ${e.stack}`);
    throw e;
  }
};

export const deletePlayerFromAvailablePlayers = async (useremail) => {
  try {
    const result = await pool.query(
      "Delete from available_players where user_id = $1",
      [useremail]
    );
    return result.rows[0];
  } catch (e) {
    console.log(`Erron in deletePlayerFromAvailablePlayers: ${e.stack}`);
    throw e;
  }
};

export const isUserAlreadyOnline = async (useremail) => {
  try {
    const result = await pool.query(
      "Select id from available_players where user_id = $1",
      [useremail]
    );
    return result.rows.length > 0;
  } catch (e) {
    console.log(`Error in isUserAlreadyOnline: ${e.stack}`);
    return false;
  }
};

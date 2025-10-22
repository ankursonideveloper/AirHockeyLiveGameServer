import pool from "../../config/db.js";

export const addPlayerInAvailablePlayers = async (id, socketid) => {
  try {
    const result = await pool.query(
      "Insert into available_players(user_id, socketid) values($1, $2) returning id",
      [id, socketid]
    );
    return result.rows[0];
  } catch (e) {
    console.log(`Erron in addPlayerInAvailablePlayers: ${e.stack}`);
    throw e;
  }
};

export const deletePlayerFromAvailablePlayers = async (id) => {
  try {
    const result = await pool.query(
      "Delete from available_players where user_id = $1",
      [id]
    );
    return result.rows[0];
  } catch (e) {
    console.log(`Erron in deletePlayerFromAvailablePlayers: ${e.stack}`);
    throw e;
  }
};

export const isUserAlreadyOnline = async (id) => {
  try {
    const result = await pool.query(
      "Select id from available_players where user_id = $1",
      [id]
    );
    return result.rows.length > 0;
  } catch (e) {
    console.log(`Error in isUserAlreadyOnline: ${e.stack}`);
    return false;
  }
};

export const fetchAllAvailableUsers = async () => {
  const allAvailableUsers = await pool.query(
    "Select u.username from available_players avl left join users u on u.id = avl.user_id"
  );
  return allAvailableUsers.rows;
};

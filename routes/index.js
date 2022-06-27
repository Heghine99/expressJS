const express = require("express");
const router = express.Router();
let user = [];

/* Register*/
router.post("/auth/register", (req, res) => {
  const { password, login, username, lastname } = req.body;
  const id = `${Date.now()}_${Math.random()}`;
  let dublication;
  try {
    user.map((u) => {
      if (u.login === login) {
        dublication = true;
      } else {
        dublication = false;
      }
    });
    const newUser = {
      id: id,
      username: username,
      lastname: lastname,
      password: password,
      login: login,
    };
    if (!dublication) {
      if (
        newUser.username.length >= 3 &&
        newUser.login.length >= 6 &&
        newUser.password.length >= 4
      ) {
        user.push(newUser);
        return res.status(200).json({
          message: "New user has been suucesfuly registred",
        });
      } else {
        return res
          .status(400)
          .json({ message: "incorect registration fields" });
      }
    } else {
      return res.status(400).json({ message: "dublication users not allowed" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

/* Login*/
router.post("/auth/login", (req, res) => {
  const { password, login } = req.body;
  try {
    if (user.length > 0) {
      user.map((u) => {
        if (u.password === password && u.login === login) {
          return res.status(200).json(u);
        }
      });
      return res.status(400).json({
        message: "invalid password or login",
      });
    } else {
      return res.status(400).json({
        message: "Do yopu not registred",
      });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

/* GET userById*/
router.get("/user/:id", (req, res) => {
  const { id } = req.params;

  try {
    if (user.length > 0) {
      user.map((item) => {
        if (item.id === id) {
          return res.status(200).json(item);
        }
      });
      return res.status(400).json({
        message: "user not found",
      });
    } else {
      return res.status(400).json({
        message: "user not found",
      });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});


/* GET all users*/
router.get("/users", (req, res) => {
  try {
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});


/* Delete*/
router.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const deletUser = user.filter((item) => item.id === id);
    const filterUser = user.filter((item) => item.id !== id);
    if (
      filterUser.length !== user.length &&
      password === deletUser[0].password
    ) {
      user = filterUser;
      return res.status(200).json(user);
    } else {
      return res.status(400).json({
        messgae: "user is not found",
      });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

/* Update */
router.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const { username, lastname, password, login } = req.body;
  try {
    if (user.length > 0) {
      user.map((item) => {
        if (item.id === id) {
          (item.username = username),
            (item.login = login),
            (item.password = password),
            (item.lastname = lastname);
          return res.status(200).json(item);
        }
      });
      return res.status(400).json({
        message: "user is not found",
      });
    } else {
      return res.status(400).json({
        message: "user is not found",
      });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

/* Search by username*/
router.get("/users/search/", (req, res) => {
  const { q } = req.query;
  try {
    const results = user.filter((u) => {
      if (q !== undefined && u.username.search(new RegExp(q, "i")) === -1) {
        return false;
      }
      return true;
    });
    if (results.length) {
      return res.status(200).json(results);
    } else {
      return res.status(200).json({
        message: "invalid query result",
      });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = router;

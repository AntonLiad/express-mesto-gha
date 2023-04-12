const Card = require("../modules/card");
const {
  ERR_BAD_REQUEST,
  ERR_NOT_FOUND,
  ERR_DEFAULT,
} = require("../errors/errors");

const checkCard = (card, res) => {
  if (card) {
    return res.send(card);
  }
  return res
    .status(ERR_NOT_FOUND)
    .send({ message: "Карточка c таким id не найдена" });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" });
    });
};

const createCard = (req, res) => {
  const data = new Date();
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        _id: card._id,
        createdAt: data,
      });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res
          .status(ERR_BAD_REQUEST)
          .send({ message: "Данные введены не корректно" });
      }
      return res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" });
    });
};

const deleteCard = (req, res) => {
  const cardId = req.params.cardId;

  Card.findByIdAndDelete(cardId)
    .then((card) => checkCard(card, res))
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(ERR_BAD_REQUEST)
          .send({ message: "Карточка не найдена" });
      }
      res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" });
    });
};

const addLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => checkCard(card, res))
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(ERR_BAD_REQUEST)
          .send({ message: "Карточка не найдена " });
      }
      return res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" });
    });
};

const removeLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => checkCard(card, res))
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(ERR_BAD_REQUEST)
          .send({ message: "Карточка не найдена" });
      }
      return res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
};

import { Router } from "express";
import { CartManager } from "../dao/cartManager.js";
const cartManager = new CartManager("./src/data/cart.json");
await cartManager.init();
export const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  try {
    const cart = req.body;
    const mensaje = await cartManager.createCart(cart);
    if (mensaje == "Carrito creado con éxito") {
      res.setHeader("Content-type", "application/json");
      res.status(200).send(mensaje);
    } else {
      res.status(400).send(mensaje);
    }
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al crear producto : ${error}`);
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await CartManager.getCart(cartManager.path);
    let id = req.params.cid;
    if (id) {
      let filtradoPorId = cart.filter((cart) => cart.id === parseInt(id));
      res.setHeader("Content-type", "application/json");
      return res.status(200).json({ payload: filtradoPorId });
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity } = req.body;
    const mensaje = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    return res.status(200).send(mensaje);
  } catch (error) {
    res
      .status(500)
      .send(
        `Error interno del servidor al añadir producto al carrito : ${error}`
      );
  }
});

import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, lastName, email, password, provider } = req.body;

    try {
      const hashedPassword = password && (await hash(password, 10));

      const user = await prisma.user.create({
        data: {
          name,
          lastName,
          email,
          password: hashedPassword,
          provider: provider || "local",
        },
      });

      // Obtener el valor de descuento de la tabla de configuraciones
      const discountConfig = await prisma.configuration.findUnique({
        where: { name: "discountValue" },
      });

      // Si no se encuentra un valor de descuento, se usará 5000 como predeterminado
      const discountValue = discountConfig
        ? parseFloat(discountConfig.value)
        : 5000;

      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setMonth(currentDate.getMonth() + 1);

      const formattedExpiryDate = `${expiryDate.getFullYear()}-${String(
        expiryDate.getMonth() + 1
      ).padStart(2, "0")}-${String(expiryDate.getDate()).padStart(
        2,
        "0"
      )} ${String(expiryDate.getHours()).padStart(2, "0")}:${String(
        expiryDate.getMinutes()
      ).padStart(2, "0")}:${String(expiryDate.getSeconds()).padStart(2, "0")}`;

      const couponData = {
        code: `AUTO${user.id}`,
        discountValue: discountValue,
        description: `Descuento de $${discountValue} para compras que superen las 35 unidades.`,
        useOnce: true,
        userId: user.id,
        used: false,
        minPurchaseUnits: 35,
        autoGenerated: true,
        expiryDate: formattedExpiryDate,
      };

      await prisma.coupon.create({ data: couponData });

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      console.error(error.stack);
      res.status(500).json({ message: "Error creating user" });
    }
  } else {
    res.status(405).json({ message: "We only support POST" });
  }
}

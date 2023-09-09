import { PrismaClient } from "@prisma/client";

export async function postUserRegistration(event) {
  const prisma = new PrismaClient();

  try {
    const { email } = event.user;

    // Intenta encontrar el usuario en la base de datos basado en su correo electrónico.
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    // Si no existe el usuario en la base de datos, entonces es un nuevo registro.
    if (!existingUser) {
      const [firstName, ...lastNameParts] = event.user.name.split(" ");
      const lastName = lastNameParts.join(" ");

      const newUser = await prisma.user.create({
        data: {
          name: firstName,
          email: email,
          lastName: lastName,
          provider: "GOOGLE",
          // Puedes añadir aquí más campos si los necesitas
        },
      });

      const discountConfig = await prisma.configuration.findUnique({
        where: { name: "discountValue" },
      });

      const discountValue = discountConfig
        ? parseFloat(discountConfig.value)
        : 5000;

      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setMonth(currentDate.getMonth() + 1);
      const expiryDateISO = expiryDate.toISOString();

      const couponData = {
        code: `AUTO${newUser.id}`,
        discountValue: discountValue,
        description: `Descuento de $${discountValue} para compras que superen las 35 unidades.`,
        useOnce: true,
        userId: newUser.id,
        used: false,
        minPurchaseUnits: 35,
        autoGenerated: true,
        expiryDate: expiryDateISO,
      };

      await prisma.coupon.create({ data: couponData });
    } else {
      console.log("User already exists:", email);
    }
  } catch (error) {
    console.error("Error during postUserRegistration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

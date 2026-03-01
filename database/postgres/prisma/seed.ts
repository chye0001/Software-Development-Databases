import "dotenv/config"
import { prisma } from "../prisma-client.js"

async function seed() {
    // 1. Create Countries
    const usa = await prisma.country.create({
        data: {
            name: "United States",
            countryCode: "US"
        }
    });

    const denmark = await prisma.country.create({
        data: {
            name: "Denmark",
            countryCode: "DK"
        }
    });

    // 2. Create Roles
    const adminRole = await prisma.role.create({
        data: {
            role: "Admin"
        }
    });

    const userRole = await prisma.role.create({
        data: {
            role: "User"
        }
    });

    // 3. Create Users
    const bob = await prisma.user.create({
        data: {
            email: "bob@example.com",
            firstName: "Bob",
            lastName: "Smith",
            roleId: userRole.id,
            countryId: usa.id
        }
    });

    const alice = await prisma.user.create({
        data: {
            email: "alice@example.com",
            firstName: "Alice",
            lastName: "Johnson",
            roleId: adminRole.id,
            countryId: denmark.id
        }
    });

    // 4. Create Brands
    const nike = await prisma.brand.create({
        data: {
            name: "Nike",
            countryId: usa.id
        }
    });

    const adidas = await prisma.brand.create({
        data: {
            name: "Adidas",
            countryId: denmark.id
        }
    });

    const ganni = await prisma.brand.create({
        data: {
            name: "Ganni",
            countryId: denmark.id
        }
    });

    // 5. Create Categories
    const shoes = await prisma.category.create({
        data: {
            name: "Shoes"
        }
    });

    const clothing = await prisma.category.create({
        data: {
            name: "Clothing"
        }
    });

    const accessories = await prisma.category.create({
        data: {
            name: "Accessories"
        }
    });

    // 6. Create Items
    const airJordan = await prisma.item.create({
        data: {
            name: "Air Jordan 1",
            price: 170.00,
            categoryId: shoes.id
        }
    });

    const ultraBoost = await prisma.item.create({
        data: {
            name: "Ultra Boost",
            price: 180.00,
            categoryId: shoes.id
        }
    });

    const hoodie = await prisma.item.create({
        data: {
            name: "Classic Hoodie",
            price: 65.00,
            categoryId: clothing.id
        }
    });

    const watch = await prisma.item.create({
        data: {
            name: "Minimalist Watch",
            price: 250.00,
            categoryId: accessories.id
        }
    });

    // 7. Create ItemBrand relationships (brand collaborations)
    await prisma.itemBrand.create({
        data: {
            itemId: airJordan.id,
            brandId: nike.id
        }
    });

    await prisma.itemBrand.create({
        data: {
            itemId: ultraBoost.id,
            brandId: adidas.id
        }
    });

    // Collaboration example: Nike x Adidas hoodie
    await prisma.itemBrand.create({
        data: {
            itemId: hoodie.id,
            brandId: nike.id
        }
    });

    await prisma.itemBrand.create({
        data: {
            itemId: hoodie.id,
            brandId: adidas.id
        }
    });

    await prisma.itemBrand.create({
        data: {
            itemId: watch.id,
            brandId: ganni.id
        }
    });

    // 8. Create Images for Items
    await prisma.image.create({
        data: {
            url: "https://example.com/airjordan1.jpg",
            itemId: airJordan.id
        }
    });

    await prisma.image.create({
        data: {
            url: "https://example.com/ultraboost.jpg",
            itemId: ultraBoost.id
        }
    });

    await prisma.image.create({
        data: {
            url: "https://example.com/hoodie.jpg",
            itemId: hoodie.id
        }
    });

    // 9. Create Closets
    const bobCloset = await prisma.closet.create({
        data: {
            name: "Bob's Wardrobe",
            description: "My everyday collection",
            isPublic: true,
            userId: bob.id
        }
    });

    const aliceCloset = await prisma.closet.create({
        data: {
            name: "Alice's Premium Collection",
            description: "High-end fashion pieces",
            isPublic: false,
            userId: alice.id
        }
    });

    // 10. Create ClosetItems
    const bobAirJordan = await prisma.closetItem.create({
        data: {
            itemId: airJordan.id,
            closetId: bobCloset.id
        }
    });

    const bobHoodie = await prisma.closetItem.create({
        data: {
            itemId: hoodie.id,
            closetId: bobCloset.id
        }
    });

    const aliceUltraBoost = await prisma.closetItem.create({
        data: {
            itemId: ultraBoost.id,
            closetId: aliceCloset.id
        }
    });

    const aliceWatch = await prisma.closetItem.create({
        data: {
            itemId: watch.id,
            closetId: aliceCloset.id
        }
    });

    // 11. Create Outfits
    const casualOutfit = await prisma.outfit.create({
        data: {
            name: "Casual Friday",
            style: "Streetwear",
            createdBy: bob.id
        }
    });

    const premiumOutfit = await prisma.outfit.create({
        data: {
            name: "Evening Elegance",
            style: "Formal",
            createdBy: alice.id
        }
    });

    // 12. Create OutfitItems (linking closet items to outfits)
    await prisma.outfitItem.create({
        data: {
            outfitId: casualOutfit.id,
            closetItemId: bobAirJordan.id
        }
    });

    await prisma.outfitItem.create({
        data: {
            outfitId: casualOutfit.id,
            closetItemId: bobHoodie.id
        }
    });

    await prisma.outfitItem.create({
        data: {
            outfitId: premiumOutfit.id,
            closetItemId: aliceUltraBoost.id
        }
    });

    await prisma.outfitItem.create({
        data: {
            outfitId: premiumOutfit.id,
            closetItemId: aliceWatch.id
        }
    });

    // 13. Create Reviews
    await prisma.review.create({
        data: {
            score: 5,
            text: "Amazing shoes! Super comfortable and stylish.",
            writtenBy: bob.id
        }
    });

    await prisma.review.create({
        data: {
            score: 4,
            text: "Great quality, a bit pricey but worth it.",
            writtenBy: alice.id
        }
    });

    console.log({
        users: { bob, alice },
        countries: { usa, denmark },
        roles: { adminRole, userRole },
        brands: { nike, adidas, ganni },
        categories: { shoes, clothing, accessories },
        items: { airJordan, ultraBoost, hoodie, watch },
        closets: { bobCloset, aliceCloset },
        outfits: { casualOutfit, premiumOutfit }
    });
    console.log("✅ Database seeded successfully!");
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
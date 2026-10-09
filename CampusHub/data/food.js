/* =========================================================
   CAMPUSHUB — CCTC SHOP SEED DATA
   Reused as the initial product data for the campus portal.
   ========================================================= */

window.foodItems = [
    {
        id: "canteen-1",
        name: "Chicken Sandwich",
        description: "Toasted chicken sandwich served with vegetables and sauce.",
        price: 60,
        category: "Meals",
        seller: "CCTC Canteen",
        location: "Main Building Canteen",
        availability: "Available",
        icon: "🥪",
        available: true
    },
    {
        id: "canteen-2",
        name: "Iced Tea",
        description: "Fresh chilled iced tea for break time and study sessions.",
        price: 25,
        category: "Drinks",
        seller: "CCTC Canteen",
        location: "Campus Snack Booth",
        availability: "Available",
        icon: "🧊",
        available: true
    },
    {
        id: "canteen-3",
        name: "Chicken Rice Meal",
        description: "Classic meal with rice, chicken, and vegetables.",
        price: 85,
        category: "Meals",
        seller: "CCTC Canteen",
        location: "Main Building Canteen",
        availability: "Sold Out",
        icon: "🍱",
        available: false
    },
    {
        id: "reg-1",
        name: "School Uniform",
        description: "Official CCTC school uniform for daily student use.",
        price: 450,
        category: "Uniforms",
        seller: "Registrar Office",
        location: "Registrar Shop",
        availability: "Available",
        icon: "👕",
        available: true,
        sizes: [
            { label: "Small", available: true },
            { label: "Medium", available: true },
            { label: "Large", available: false },
            { label: "XL", available: true }
        ]
    },
    {
        id: "reg-2",
        name: "School Shirt",
        description: "Official school shirt for events and daily wear.",
        price: 250,
        category: "Apparel",
        seller: "Registrar Office",
        location: "Registrar Shop",
        availability: "Available",
        icon: "🎽",
        available: true,
        sizes: [
            { label: "Small", available: true },
            { label: "Medium", available: true },
            { label: "Large", available: true }
        ]
    }
];

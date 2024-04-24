

import {fakerES_MX as faker} from '@faker-js/faker'

export function generateMockedProducts(cantidad) {try {
    const mockedProducts = [];
    
    for (let i = 1; i <= cantidad; i++) {
        const product = {
            code: `MOCK-${i}`,
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price({max: 200}),
            thumbnails: [faker.image.url(), faker.image.url()],
            stock: faker.number.int({ min: 10, max: 20 }),
            category: faker.commerce.department(),
            status: true,
        };

        mockedProducts.push(product);
    }

    return mockedProducts;

} catch (error) {
    return error.message
}

}
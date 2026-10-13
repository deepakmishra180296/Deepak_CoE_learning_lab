export interface ProductData {
    name: string;
    quantity: number;
    price?: number;
    category?: string;
}

export class ProductBuilder {
    private product: ProductData = {
        name: 'Cucumber',
        quantity: 1,
    };

    withName(name: string): this {
        this.product.name = name;
        return this;
    }

    withQuantity(quantity: number): this {
        this.product.quantity = quantity;
        return this;
    }

    withPrice(price: number): this {
        this.product.price = price;
        return this;
    }

    withCategory(category: string): this {
        this.product.category = category;
        return this;
    }

    build(): ProductData {
        return { ...this.product };
    }
}
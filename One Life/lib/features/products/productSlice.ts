import { createAppSlice } from "@/lib/createAppSlice";
import { ApiResponse, Pagination, Product, ProductDefaultParams } from "@/types/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAllProducts } from "./productAPI";



export interface ProductSliceState {
    products: Pagination<any>;
    product: Product | ProductDefaultParams;
    productModal: boolean;
    status: "idle" | "loading" | "failed";
    error: null | string;
}

const initialState: ProductSliceState = {
    products: {
        count: 0,
        next: null,
        previous: null,
        results: [{
            "id": 1,
            "thumb": null,
            "name": "Current Account",
            "description": "That is why we have a wide range of accounts to fit everyone, regardless of situation or lifestyle. So whether you want a basic account or one bursting with options, you will find the right account that meets your expectations.",
            price: '--',
            rating: 4,
            images: [
                {
                    id: 1,
                    name: 'Angled view',
                    src: 'https://www.ubazambia.com/wp-content/uploads/sites/23/2018/11/UBA-Zambia-Current-Account.jpg',
                    alt: 'Angled front view with bag zipped and handles upright.',
                },
            ],
            details: [
                {
                    name: 'Features',
                    items: [
                        "Opening balance of K150",
                        "Zero minimum operating balance",
                        "Access to consumer credit facilities",
                        "Lodgment of cheques and dividend warrants",
                        "Cheque book enabled"
                    ],
                },
                {
                    name: 'Benefits',
                    items: [
                        "No restrictions on the withdrawal frequency or amounts from funded account",
                        "Third party transactions allowed",
                        "No restrictions on deposit amounts",
                        "Cheque lodgment allowed",
                        "Access to internet and mobile banking",
                        "Access to UBA Master Card & Visa Card(for ATM, Internet and POS transactions)"
                    ],
                },

            ],
            "author": {
                "id": 1,
                "first_name": "Kev",
                "last_name": "Banda",
                "phone_number": "Personal",
                "email": "admin@gmail.com"
            },
            "is_pub": false,
            "category": "Personal",
            "img": null
        },
        {
            "id": 2,
            "thumb": null,
            "name": "UBA Kiddies Savings Account",
            "description": "It’s never too early to get them started, open a UBA kiddies account and enjoy amazing benefits. The kiddies Account allows parents to start saving for their kids as soon as they are born, and as they grow older, educate them about money and savings",
            price: '--',
            rating: 4,
            images: [
                {
                    id: 1,
                    name: 'Angled view',
                    src: 'https://www.ubazambia.com/wp-content/uploads/sites/23/2021/04/pexels-nappy-3584088-2048x1366.jpg',
                },
            ],
            details: [
                {
                    name: 'Features',
                    items: [
                        "Minimum initial opening balance of ZMW50",
                        "Minimum operating balance ZMW50",
                        "No maximum deposit",
                        "Allows direct deposits and cash transfers",
                        "Allows lodgement of dividend warrants and cheques",
                        "ATM fee of ZMW 5 for an amount less than ZMW 100 and ZMW 7 for amounts more than ZMW 100",
                        "Monthly maintenance fee zero",
                        "Maximum of 3 withdrawals per month if exceeded forfeit the interest earned."
                    ],
                },
                {
                    name: 'Requirements',
                    items: [
                        " Application letter (on Company headed paper)",
                        "Copy of memorandum of articles of association",
                        "Certificate of share capital, form 10",
                        " Certificate of incorporation, form 6, 7, 8 or 9",
                        "List of share holders, form 28",
                        "List of directors and secretary, form 45"
                    ],
                },
                {
                    name: 'Benefits',
                    items: [
                        "4 % interest per annum paid quarterly",
                        "Cheque book allowed",
                        " Minimum of K6000 maintained in the account for 12 months, 5% additional bonus interest to be paid.",
                        "Free Debit Visa card and Mastercard for ATM.",
                        "Free internet transactions and POS machine transactions on the account"

                    ],
                },

            ],
            "author": {
                "id": 1,
                "first_name": "Kev",
                "last_name": "Banda",
                "phone_number": null,
                "email": "admin@gmail.com"
            },
            "is_pub": false,
            "category": "Personal",
            "img": null
        },
        {
            "id": 3,
            "thumb": null,
            "name": "SME Domiciliary Account",
            "description": "Building a successful business requires the right support. We provide financial products and services specifically designed to help your business grow.",
            price: '--',
            rating: 4,
            images: [
                {
                    id: 1,
                    name: 'Angled view',
                    src: 'https://www.ubazambia.com/wp-content/uploads/sites/23/2022/01/i-did-it_5_11zon-scaled.jpg',
                },
            ],
            details: [
                {
                    name: 'Features',
                    items: [

                    ],
                },
                {
                    name: 'Requirements',
                    items: [
                        " Application letter (on Company headed paper)",
                        "Copy of memorandum of articles of association",
                        "Certificate of share capital, form 10",
                        " Certificate of incorporation, form 6, 7, 8 or 9",
                        "List of share holders, form 28",
                        "List of directors and secretary, form 45"
                    ],
                },
                {
                    name: 'Benefits',
                    items: [
                        "$100 opening balance and fixed monthly charges",
                        "Access to business loans",
                        "On boarding on digital collection solutions",
                        "Access to MSME masterclasses and advisory",
                        "Access to the bank’s SME events and fairs",
                        "Access to a free online marketplace (as applicable)"
                    ],
                },

            ],
            "author": {
                "id": 1,
                "first_name": "Kev",
                "last_name": "Banda",
                "phone_number": null,
                "email": "admin@gmail.com"
            },
            "is_pub": false,
            "category": "SME BANKING",
            "img": null
        },
        {
            "id": 4,
            "thumb": null,
            "name": "UBA SME Account",
            "description": "Specifically for SMEs to provide them the right framework of support and financial solutions they need to grow.",
            price: '--',
            rating: 4,
            images: [
                {
                    id: 1,
                    name: 'Angled view',
                    src: 'https://www.ubazambia.com/wp-content/uploads/sites/23/2022/01/i-did-it_5_11zon-scaled.jpg',
                },
            ],
            details: [
                {
                    name: 'Features',
                    items: [

                    ],
                },
                {
                    name: 'Benefits',
                    items: [
                        " ZMW 500 opening balance and fixed monthly charges",
                        "Access to business loans",
                        "On boarding on digital collection solutions",
                        "Access to MSME masterclasses and advisory",
                        "Access to the bank’s SME events and fairs",
                        "Access to a free online marketplace (as applicable)"

                    ],
                },

            ],
            "author": {
                "id": 1,
                "first_name": "Kev",
                "last_name": "Banda",
                "phone_number": null,
                "email": "admin@gmail.com"
            },
            "is_pub": false,
            "category": "SME BANKING",
            "img": null
        },
        ]
    },
    product: {
        name: "",
        description: "",
        price: 0,
    },
    productModal: false,
    status: "idle",
    error: null,
};

export const productSlice = createAppSlice({
    name: 'product',
    initialState,
    reducers: (create) => ({
        updateProducts: create.reducer((state, action: PayloadAction<Product[]>) => {
            state.status = 'idle';
            state.products.results = action.payload;
        }),
        setProductModal: create.reducer((state, action: PayloadAction<boolean>) => {
            state.status = 'idle';
            state.productModal = action.payload;
        }),
        updateProductState: create.reducer((state, action: PayloadAction<Product | ProductDefaultParams>) => {
            state.status = 'idle';
            state.product = action.payload;
        }),
        fetchAllProductAsync: create.asyncThunk(
            async () => {
                try {
                    const response: ApiResponse = await getAllProducts();
                    if (response.error) {
                        throw new Error(response.error);
                    }
                    return response;
                } catch (error) {
                    throw new Error("Data fetch failed: " + (error as Error).message);
                }
            },
            {
                pending: (state) => { state.status = "loading"; },
                fulfilled: (state, action) => { state.status = "idle"; state.products = action.payload; },
                rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
            },
        ),
    }),
    selectors: {
        selectProducts: (product) => product.products,
        selectProduct: (product) => product.product,
        selectProductState: (product) => product,
        selectProductModal: (ticket) => ticket.productModal,

    }
});

export const { fetchAllProductAsync, updateProducts, updateProductState, setProductModal } = productSlice.actions;

export const { selectProducts, selectProductState, selectProduct, selectProductModal } = productSlice.selectors
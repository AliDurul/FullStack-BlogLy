'use client'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import ProductTable from './ProductTable';
import ProductGrid from './ProductGrid';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllProductAsync, selectProducts, setProductModal, updateProductState, updateProducts } from '@/lib/features/products/productSlice';
import { Product } from '@/types/types';
import ProductModal from './ProductModal';
import useDeleteToasts from '@/hooks/useDeleteToasts';
import { deleteProduct } from '@/lib/features/products/productAPI';

const IMG_URL = process.env.NEXT_PUBLIC_IMG_APIBASE_URL;


const ProductViews = () => {

    const { deleteToast } = useDeleteToasts();

    const dispatch = useAppDispatch();
    const products = useAppSelector(selectProducts)



    useEffect(() => {
        dispatch(fetchAllProductAsync({}));
    }, [dispatch])


    const [value, setValue] = useState<any>('list');
    const [defaultParams] = useState({
        name: "",
        description: "",
        price: 0,
    });

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const [search, setSearch] = useState('');

    const [filteredItems, setFilteredItems] = useState<Product[]>(products.results);

    const searchProduct = () => {
        setFilteredItems(() => {
            return products.results?.filter((product: Product) => {
                return product.name.toLowerCase().includes(search.toLowerCase());
            });
        });
    };

    useEffect(() => {
        searchProduct();
    }, [search, products.results]);

    // const saveProduct = () => {
    //     if (!params.name) {
    //         showMessage('Name is required.', 'error');
    //         return true;
    //     }
    //     if (!params.email) {
    //         showMessage('Email is required.', 'error');
    //         return true;
    //     }
    //     if (!params.phone) {
    //         showMessage('Phone is required.', 'error');
    //         return true;
    //     }
    //     if (!params.role) {
    //         showMessage('Occupation is required.', 'error');
    //         return true;
    //     }

    //     if (params.id) {
    //         //update product
    //         let product: any = filteredItems.find((d: any) => d.id === params.id);
    //         product.name = params.name;
    //         product.email = params.email;
    //         product.phone = params.phone;
    //         product.role = params.role;
    //         product.location = params.location;
    //     } else {
    //         //add product
    //         let maxProductId = filteredItems.length ? filteredItems.reduce((max: any, character: any) => (character.id > max ? character.id : max), filteredItems[0].id) : 0;

    //         let product = {
    //             id: maxProductId + 1,
    //             path: 'profile-35.png',
    //             name: params.name,
    //             email: params.email,
    //             phone: params.phone,
    //             role: params.role,
    //             location: params.location,
    //             posts: 20,
    //             followers: '5K',
    //             following: 500,
    //         };
    //         filteredItems.splice(0, 0, product);
    //         //   searchProducts();
    //     }

    //     showMessage('Product has been saved successfully.');
    //     dispatch(setProductModal(false))
    // };

    const editProductFunc = (product: Product) => {
        dispatch(updateProductState(product))
        dispatch(setProductModal(true))
    };


    const deleteProductFunc = async (productId: number) => {
        const deletionSuccess = await deleteToast(productId.toString(), deleteProduct, updateProducts);

        // if (deletionSuccess) showMessage('Product has been deleted successfully.', 'success');
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-end gap-4">
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => { dispatch(setProductModal(true)), dispatch(updateProductState(defaultParams)) }}>
                                <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                    <path
                                        opacity="0.5"
                                        d="M18 17.5C18 19.9853 18 22 10 22C2 22 2 19.9853 2 17.5C2 15.0147 5.58172 13 10 13C14.4183 13 18 15.0147 18 17.5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path d="M21 10H19M19 10H17M19 10L19 8M19 10L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                Add Product
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${value === 'list' && 'bg-primary text-white'}`} onClick={() => setValue('list')}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                    <path d="M2 5.5L3.21429 7L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path opacity="0.5" d="M2 12.5L3.21429 14L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 19.5L3.21429 21L7.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 19L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path opacity="0.5" d="M22 12L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M22 5L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${value === 'grid' && 'bg-primary text-white'}`} onClick={() => setValue('grid')}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                    <path
                                        opacity="0.5"
                                        d="M2.5 6.5C2.5 4.61438 2.5 3.67157 3.08579 3.08579C3.67157 2.5 4.61438 2.5 6.5 2.5C8.38562 2.5 9.32843 2.5 9.91421 3.08579C10.5 3.67157 10.5 4.61438 10.5 6.5C10.5 8.38562 10.5 9.32843 9.91421 9.91421C9.32843 10.5 8.38562 10.5 6.5 10.5C4.61438 10.5 3.67157 10.5 3.08579 9.91421C2.5 9.32843 2.5 8.38562 2.5 6.5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        opacity="0.5"
                                        d="M13.5 17.5C13.5 15.6144 13.5 14.6716 14.0858 14.0858C14.6716 13.5 15.6144 13.5 17.5 13.5C19.3856 13.5 20.3284 13.5 20.9142 14.0858C21.5 14.6716 21.5 15.6144 21.5 17.5C21.5 19.3856 21.5 20.3284 20.9142 20.9142C20.3284 21.5 19.3856 21.5 17.5 21.5C15.6144 21.5 14.6716 21.5 14.0858 20.9142C13.5 20.3284 13.5 19.3856 13.5 17.5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d="M2.5 17.5C2.5 15.6144 2.5 14.6716 3.08579 14.0858C3.67157 13.5 4.61438 13.5 6.5 13.5C8.38562 13.5 9.32843 13.5 9.91421 14.0858C10.5 14.6716 10.5 15.6144 10.5 17.5C10.5 19.3856 10.5 20.3284 9.91421 20.9142C9.32843 21.5 8.38562 21.5 6.5 21.5C4.61438 21.5 3.67157 21.5 3.08579 20.9142C2.5 20.3284 2.5 19.3856 2.5 17.5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d="M13.5 6.5C13.5 4.61438 13.5 3.67157 14.0858 3.08579C14.6716 2.5 15.6144 2.5 17.5 2.5C19.3856 2.5 20.3284 2.5 20.9142 3.08579C21.5 3.67157 21.5 4.61438 21.5 6.5C21.5 8.38562 21.5 9.32843 20.9142 9.91421C20.3284 10.5 19.3856 10.5 17.5 10.5C15.6144 10.5 14.6716 10.5 14.0858 9.91421C13.5 9.32843 13.5 8.38562 13.5 6.5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Products" className="peer form-input py-2 ltr:pr-11 rtl:pl-11" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                                <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {value === 'list' && <ProductTable filteredItems={filteredItems} editProduct={editProductFunc} deleteProduct={deleteProductFunc}  />}

            {value === 'grid' && <ProductGrid filteredItems={filteredItems} editProduct={editProductFunc} deleteProduct={deleteProductFunc} />}

            <ProductModal />
        </div>
    )
}

export default ProductViews
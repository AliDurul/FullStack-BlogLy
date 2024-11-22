'use client'
import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllProductAsync, selectProduct, selectProductModal, setProductModal, updateProducts } from '@/lib/features/products/productSlice';
import { Product, ProductDefaultParams } from '@/types/types';
import { createProduct, updateProduct } from '@/lib/features/products/productAPI';
import { coloredToast } from '@/utils/sweetAlerts';

const ProductModal = () => {
    const productModal = useAppSelector(selectProductModal)
    const product = useAppSelector(selectProduct)
    const dispatch = useAppDispatch()

    const [params, setParams] = useState<Product | ProductDefaultParams>((JSON.parse(JSON.stringify(product))))

    useEffect(() => {
        setParams(product)
    }, [product])

    const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (params.id) {
            try {
                // @ts-ignore
                const { author, img, thumb, ...updateData } = params
                const res = await updateProduct(updateData)
                if (res.message) {
                    coloredToast('success', res.message)
                    dispatch(setProductModal(false))
                    dispatch(fetchAllProductAsync({}));

                }
                else throw new Error(res.error)

            } catch (error: any) {
                coloredToast('danger', error.message)
            }
        } else {
            try {
                const res = await createProduct(params)

                if (res.message) {
                    coloredToast('success', res.message)
                    dispatch(updateProducts(res.data))
                    dispatch(setProductModal(false))
                }
                else throw new Error(res.error)

            } catch (error: any) {
                coloredToast('danger', error.message)
            }
        }

    }


    return (
        <Transition appear show={productModal} as={Fragment}>
            <Dialog as="div" open={productModal} onClose={() => dispatch(setProductModal(false))} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <button
                                    type="button"
                                    onClick={() => dispatch(setProductModal(false))}
                                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                                <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                    {params.id ? 'Edit Product' : 'Add Product'}
                                </div>
                                <div className="p-5">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-5">
                                            <label htmlFor="name">Name</label>
                                            <input required id="name" name="name" type="text" placeholder="Enter Name" className="form-input"
                                                value={params.name}
                                                onChange={(e) => changeHandle(e)} />
                                        </div>

                                        <div className="mb-5">
                                            <label htmlFor="price">Price</label>
                                            <input required id="price" name="price" type="number" placeholder="Enter Price" className="form-input"
                                                value={params.price}
                                                onChange={(e) => changeHandle(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="description">Description</label>
                                            <input required id="description" type="description" placeholder="Enter Description" className="form-input"
                                                value={params.description}
                                                onChange={(e) => changeHandle(e)} />
                                        </div>
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => dispatch(setProductModal(false))}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                {params.id ? 'Update' : 'Add'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ProductModal
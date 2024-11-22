'use client'
import { Field, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllKycAsync, selectKyc, updateKycState } from '@/lib/features/kyc/kycSlice';
import { createKyc, updateKyc, } from '@/lib/features/kyc/kycAPI';
import { coloredToast } from '@/utils/sweetAlerts';
import MaskedInput from 'react-text-mask';
import Select from 'react-select';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { bankOp, countryOp, genderOp, idTypeOp, maritalOp, maskConfig, relationOp, religionOp, getMaskForIdType } from '../components/KycConstarints';
import { getAllTickets } from '@/lib/features/tickets/ticketAPI';
import { Ticket } from '@/types/types';
import KycUserTicketsInfo from '../components/KycUserTicketsInfo';
import TopPageNavigation from '@/app/components/TopPageNavigation';
import Image from 'next/image';


const KycActionPage = () => {

    const IMG_URL = 'http://192.168.1.111:8000'

    const kyc = useAppSelector(selectKyc);
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()
    const router = useRouter()

    const userId = searchParams.get('userId')
    const source = searchParams.get('s')
    const readOnly = source === 'r';

    const [userTickets, setUserTickets] = useState<Ticket[]>([])
    // file upload
    const [images, setImages] = useState<any>([]);
    const maxNumber = 69;

    const fetchTicketsForUser = async (userId: string | null) => {
        const data = await getAllTickets(userId ? userId.toString() : null)
        setUserTickets(data.results)
    }

    /* const fetchKyc = async () => {
        const kycInfo = await readKyc(Number(userId))
        dispatch(updateKycState(kycInfo))
    } */

    /*   useEffect(() => {
          if (userId) fetchKyc()
      }, []) */

    useEffect(() => {
        fetchTicketsForUser(userId)
    }, [kyc])

    const activeTickets = userTickets.filter((t: Ticket) => t.status === 'Active').length
    const pendingTickets = userTickets.filter((t: Ticket) => t.status === 'Pending').length
    const cancelledTickets = userTickets.filter((t: Ticket) => t.status === 'Cancelled').length
    const resolvedTickets = userTickets.filter((t: Ticket) => t.status === 'Resolved').length
    const escalatedTickets = userTickets.filter((t: Ticket) => t.status === 'Escalated').length

    const summaryArray = [
        { title: 'Active Tickets', value: activeTickets, customStyle: 'bg-secondary-light text-secondary' },
        { title: 'Pending Tickets', value: pendingTickets, customStyle: 'bg-info-light text-info' },
        { title: 'Cancelled Tickets', value: cancelledTickets, customStyle: 'bg-danger-light text-danger' },
        { title: 'Resolved Tickets', value: resolvedTickets, customStyle: 'bg-success-light text-success' },
        { title: 'Escalated Tickets', value: escalatedTickets, customStyle: 'bg-warning-light text-warning' },

    ]

    interface CustomStyles {
        control: (provided: any) => any;
    }

    const customStyles: CustomStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: readOnly ? 'white' : provided.backgroundColor,
        })
    };

    const { id, first_name, last_name, email, phone_number, father_name, mother_name, witness_name, witness_relation } = kyc || {}

    const initialValues = {
        id: id || 0,
        first_name: first_name || '',
        last_name: last_name || '',
        father_name: kyc?.father_name || '',
        mother_name: kyc?.mother_name || '',
        witness_name: kyc?.witness_name || '',
        witness_relation: kyc?.witness_relation || '',
        dob: kyc?.dob || '',
        user_age: kyc?.user_age || '',
        gender: kyc?.gender || 'Male',
        marital_status: kyc?.marital_status || 'Single',
        religion: kyc?.religion || 'Christian',
        country: kyc?.country || 'Zambia',
        id_type: kyc?.id_type || 'NRC',
        id_number: kyc?.id_number || '',
        email: email || '',
        medication: kyc?.medication || false,
        medication_type: kyc?.medication_type || '',
        location: kyc?.location || '',
        childrens: kyc?.childrens || 0,
        boys: kyc?.boys || 0,
        girls: kyc?.girls || 0,
        banks: kyc?.banks || '',
        date_joined: kyc?.date_joined || '',
        phone_number: phone_number || '',
        profession: kyc?.profession || '',
        profile_pic: kyc?.profile_pic || null,
        user_type: 'Customer',
    };


    return (
        <div>
            <TopPageNavigation />

            <div className="pt-5">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {

                        const formData = new FormData();

                        Object.keys(values).forEach(key => {
                            formData.append(key, values[key as keyof typeof values] as string);
                        })

                        if (kyc) {
                            const res = await updateKyc(formData)

                            setTimeout(() => {
                                if (res.message) {
                                    resetForm();
                                    router.replace('/kyc')
                                    coloredToast("success", res.message, "bottom-start");
                                    // dispatch(getAllFrimAsync());
                                    dispatch(updateKycState(null))
                                } else {
                                    coloredToast("danger", res.error, "bottom-start");
                                }
                            }, 500);
                        } else {

                            formData.append('user_type', 'Customer');
                            formData.append('password', 'default-password');

                            const res = await createKyc(formData);

                            setTimeout(() => {
                                setSubmitting(false);
                                if (!res.error) {
                                    coloredToast("success", res.message, "bottom-start");
                                    dispatch(fetchAllKycAsync({}));
                                    dispatch(updateKycState(res))
                                    resetForm();
                                    router.replace('/kyc')
                                } else {
                                    coloredToast("danger", res.error, "bottom-start");
                                }
                            }, 500);
                        }

                    }}
                >
                    {
                        ({ values, errors, touched, setFieldValue }) => (
                            <Form className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                                <div className="panel">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-lg font-semibold dark:text-white-light">Profile</h5>
                                    </div>
                                    <div className="mb-5">
                                        <div className="flex flex-col items-center justify-center">
                                            {
                                                readOnly ? (
                                                    <Image
                                                        src={kyc?.profile_pic ? IMG_URL + kyc.profile_pic : '/assets/images/profile-pic.png'}
                                                        alt="profile"
                                                        width={120}
                                                        height={120}
                                                        className="rounded-full my-5" />
                                                ) : (
                                                    <div className="custom-file-container my-3 mb-8" data-upload-id="myFirstImage">
                                                        <label className="custom-file-container__custom-file h-0"></label>
                                                        <input type="file" className="custom-file-container__custom-file__custom-file-input h-0 w-full" accept="image/*" />
                                                        <input type="hidden" name="MAX_FILE_SIZE" value="10485760 " />
                                                        <ImageUploading
                                                            value={images}
                                                            onChange={(imageList) => {
                                                                setImages(imageList as never[]);

                                                                if (imageList.length > 0) {
                                                                    setFieldValue('profile_pic', imageList[0].file);
                                                                } else {
                                                                    setFieldValue('profile_pic', '');
                                                                }
                                                            }}
                                                            maxNumber={maxNumber}>

                                                            {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                                                                <div className="-mt-10">
                                                                    <div className='flex gap-3 justify-center items-center'>
                                                                        <div className="flex-1 inset-0 z-5 h-10 overflow-hidden rounded border border-[#f1f2f3] bg-[#f1f2f3] px-3 py-2 text-sm leading-6 text-[#333] select-none cursor-pointer" onClick={onImageUpload}>
                                                                            Choose Pic...
                                                                        </div>
                                                                        <div className="text-[#333] text-[26px]  cursor-pointer" title="Clear Image" onClick={() => { setImages([]); setFieldValue('profile_pic', ''); }}>
                                                                            ×
                                                                        </div>
                                                                    </div>
                                                                    {imageList.map((image, index) => (
                                                                        <div key={index} className="custom-file-container__image-preview relative mt-3">
                                                                            <Image width={100} height={100} src={image.dataURL || ''} alt="user profile" className="m-auto max-w-md  rounded-full  object-cover" />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                        </ImageUploading>
                                                        {images.length === 0 ? <Image width={100} height={100} src="/assets/images/file-preview.svg" className="m-auto  max-w-md  rounded-full object-cover mt-3" alt="user profile" /> : ''}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <ul className="m-auto  flex flex-col space-y-4 font-semibold text-white-dark">
                                            <li className="">
                                                <label htmlFor="first_name" className='pl-2'>First Name</label>
                                                <Field name='first_name' id="first_name" type="text" placeholder="Enter First Name" className="form-input" disabled={source === 'r'} required />
                                            </li>
                                            {/* <li className="">
                                                <label htmlFor="middle_name" className='pl-2'>Middle Name</label>
                                                <Field name='middle_name' id="middle_name" type="text" placeholder="Enter First Name" className="form-input" disabled={source === 'r'} />
                                            </li> */}
                                            <li className="">
                                                <label htmlFor="last_name" className='pl-2'>Last Name</label>
                                                <Field name='last_name' id="last_name" type="text" placeholder="Enter First Name" className="form-input" disabled={source === 'r'} required />
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                    <path
                                                        d="M2.3153 12.6978C2.26536 12.2706 2.2404 12.057 2.2509 11.8809C2.30599 10.9577 2.98677 10.1928 3.89725 10.0309C4.07094 10 4.286 10 4.71612 10H15.2838C15.7139 10 15.929 10 16.1027 10.0309C17.0132 10.1928 17.694 10.9577 17.749 11.8809C17.7595 12.057 17.7346 12.2706 17.6846 12.6978L17.284 16.1258C17.1031 17.6729 16.2764 19.0714 15.0081 19.9757C14.0736 20.6419 12.9546 21 11.8069 21H8.19303C7.04537 21 5.9263 20.6419 4.99182 19.9757C3.72352 19.0714 2.89681 17.6729 2.71598 16.1258L2.3153 12.6978Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path opacity="0.5" d="M17 17H19C20.6569 17 22 15.6569 22 14C22 12.3431 20.6569 11 19 11H17.5" stroke="currentColor" strokeWidth="1.5" />
                                                    <path
                                                        opacity="0.5"
                                                        d="M10.0002 2C9.44787 2.55228 9.44787 3.44772 10.0002 4C10.5524 4.55228 10.5524 5.44772 10.0002 6"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M4.99994 7.5L5.11605 7.38388C5.62322 6.87671 5.68028 6.0738 5.24994 5.5C4.81959 4.9262 4.87665 4.12329 5.38382 3.61612L5.49994 3.5"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M14.4999 7.5L14.6161 7.38388C15.1232 6.87671 15.1803 6.0738 14.7499 5.5C14.3196 4.9262 14.3767 4.12329 14.8838 3.61612L14.9999 3.5"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>{' '}
                                                <Field name='profession' id="name" type="text" placeholder="Enter Profession" className="form-input" disabled={source === 'r'} required />
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                    <path
                                                        d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path opacity="0.5" d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path opacity="0.5" d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path opacity="0.5" d="M2 9H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                <Field name='dob' id="dob" type="date" placeholder="Enter DOB / yyyy-mm-dd" className="form-input" disabled={source === 'r'} required />
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        opacity="0.5"
                                                        d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path
                                                        d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <Field name='email' id="email" type="text" placeholder="Enter Email" className="form-input" disabled={source === 'r'} required />
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M5.00659 6.93309C5.04956 5.7996 5.70084 4.77423 6.53785 3.93723C7.9308 2.54428 10.1532 2.73144 11.0376 4.31617L11.6866 5.4791C12.2723 6.52858 12.0372 7.90533 11.1147 8.8278M17.067 18.9934C18.2004 18.9505 19.2258 18.2992 20.0628 17.4622C21.4558 16.0692 21.2686 13.8468 19.6839 12.9624L18.5209 12.3134C17.4715 11.7277 16.0947 11.9628 15.1722 12.8853"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M5.00655 6.93311C4.93421 8.84124 5.41713 12.0817 8.6677 15.3323C11.9183 18.5829 15.1588 19.0658 17.0669 18.9935M15.1722 12.8853C15.1722 12.8853 14.0532 14.0042 12.0245 11.9755C9.99578 9.94676 11.1147 8.82782 11.1147 8.82782"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                                <Field
                                                    as={MaskedInput}
                                                    id="phone_number"
                                                    name="phone_number"
                                                    type="text"
                                                    disabled={source === 'r'}
                                                    placeholder={maskConfig.phone_number.placeholder}
                                                    className={`form-input ${touched.phone_number && errors.phone_number ? "border-red-500" : ""}`}
                                                    required
                                                    mask={maskConfig.phone_number.mask}
                                                />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="panel lg:col-span-2 xl:col-span-3">
                                    <div className="mb-5">
                                        <h5 className="text-lg font-semibold dark:text-white-light">Details</h5>
                                    </div>
                                    <div className="mb-5">
                                        <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                            <div>
                                                <label htmlFor="Gender">Gender</label>
                                                <Select placeholder="Select Gender" options={genderOp} id='Gender'
                                                    value={genderOp.find(option => option.value === values.gender)}
                                                    onChange={option => setFieldValue('gender', option ? option.value : '')}
                                                    isDisabled={readOnly}
                                                    styles={customStyles}
                                                    menuIsOpen={readOnly ? false : undefined}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="user_age">Age</label>
                                                <Field name='user_age' id="user_age" type="number" className="form-input" required disabled={source === 'r'} />
                                            </div>
                                            <div>
                                                <label htmlFor="id_type">Id Type </label>
                                                <Select placeholder="Select witness relation" options={idTypeOp} id='id_type'
                                                    value={idTypeOp.find(option => option.value === values.id_type)}
                                                    onChange={option => setFieldValue('id_type', option ? option.value : '')}
                                                    isDisabled={readOnly}
                                                    styles={customStyles}
                                                    menuIsOpen={readOnly ? false : undefined}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="id_number">Nrc No</label>
                                                <Field
                                                    as={MaskedInput}
                                                    id="id_number"
                                                    name="id_number"
                                                    type="text"
                                                    disabled={source === 'r'}
                                                    placeholder={getMaskForIdType(values.id_type)?.placeholder}
                                                    className={`form-input ${touched.id_number && errors.id_number ? "border-red-500" : ""}`}
                                                    required
                                                    //@ts-ignore
                                                    mask={getMaskForIdType(values.id_type)?.mask}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="Religion">Religion</label>
                                                <Select placeholder="Select Religion" options={religionOp} id='Religion'
                                                    value={religionOp.find(option => option.value === values.religion)}
                                                    onChange={option => setFieldValue('religion', option ? option.value : '')}
                                                    isDisabled={readOnly}
                                                    styles={customStyles}
                                                    menuIsOpen={readOnly ? false : undefined}

                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="matrial_status">Marital Status</label>
                                                <Select placeholder="Select status of marital" options={maritalOp}
                                                    value={maritalOp.find(option => option.value === values.marital_status)}
                                                    onChange={option => setFieldValue('marital_status', option ? option.value : '')}
                                                    isDisabled={readOnly}
                                                    styles={customStyles}
                                                    menuIsOpen={readOnly ? false : undefined}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="childrens">Childeren</label>
                                                <Field name='childrens' id="childrens" type="number" className="form-input" disabled={source === 'r'} />
                                            </div>
                                            <div>
                                                <label htmlFor="boys">Boys</label>
                                                <Field name='boys' id="boys" type="number" className="form-input" disabled={source === 'r'} />
                                            </div>
                                            <div>
                                                <label htmlFor="girls">Girls</label>
                                                <Field name='girls' id="girls" type="number" className="form-input" disabled={source === 'r'} />
                                            </div>
                                            <div>
                                                <label htmlFor="location">Home Address</label>
                                                <Field name='location' id="location" type="text" className="form-input" disabled={source === 'r'} required />
                                            </div>
                                            {/* <div>
                                                <label htmlFor="occupation">Occupation</label>
                                                <Field name='occupation' id="occupation" type="text" placeholder="New York" className="form-input" disabled={source === 'r'} required />
                                            </div> */}
                                            <div>
                                                <label htmlFor="father_name">Father Name</label>
                                                <Field name='father_name' id="father_name" type="text" placeholder="Enter Father Name" className="form-input" disabled={source === 'r'} required />
                                            </div>
                                            <div>
                                                <label htmlFor="mother_name">Mother Name</label>
                                                <Field name='mother_name' id="mother_name" type="text" placeholder="Enter Mother Name" className="form-input" disabled={source === 'r'} required />
                                            </div>
                                            <div>
                                                <label htmlFor="witness_name">Witness Name</label>
                                                <Field name='witness_name' id="witness_name" type="text" placeholder="Enter Witness Name" className="form-input" disabled={source === 'r'} />
                                            </div>
                                            <div>
                                                <label htmlFor="witness_relation">Witness Relation</label>
                                                <Select placeholder="Select witness relation" options={relationOp} id='witness_relation'
                                                    value={relationOp.find(option => option.value === values.witness_relation)}
                                                    onChange={option => setFieldValue('witness_relation', option ? option.value : '')}
                                                    isDisabled={readOnly}
                                                    styles={customStyles}
                                                    menuIsOpen={readOnly ? false : undefined}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="country">Nationality</label>
                                                <Select placeholder="Select Nationality" options={countryOp} id='country'
                                                    value={countryOp.find(option => option.value === values.country)}
                                                    onChange={option => setFieldValue('country', option ? option.value : '')}
                                                    isDisabled={readOnly}
                                                    styles={customStyles}
                                                    menuIsOpen={readOnly ? false : undefined}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="banks">Finincial Institution</label>
                                                <Select placeholder="Select Finincial Institution" options={bankOp} id='banks'
                                                    value={bankOp.find(option => option.value === values.banks)}
                                                    onChange={option => setFieldValue('banks', option ? option.value : '')}
                                                    isDisabled={readOnly}
                                                    styles={customStyles}
                                                    menuIsOpen={readOnly ? false : undefined}
                                                />
                                            </div>
                                            {/* <div>
                                                <label htmlFor="family_type">Family Type</label>
                                                <Select placeholder="Select Finincial Institution" options={familyOp} id='family_type'
                                                    value={familyOp.find(option => option.value === values.family_type)}
                                                    onChange={option => setFieldValue('family_type', option ? option.value : '')}
                                                    isDisabled={source === 'r'}
                                                />
                                            </div> */}
                                            {values.medication && <div>
                                                <label htmlFor="medication_type">Medication Type</label>
                                                <Field name='medication_type' id="medication_type" type="text" placeholder="Medication Type" className="form-input" disabled={source === 'r'} />
                                            </div>}
                                            <div className=''>
                                                <label htmlFor="id_type">Medication</label>
                                                <div className="flex gap-3">
                                                    <label className="inline-flex">
                                                        <input type="radio" name="square_text_radio" className="form-radio text-info rounded-none peer" checked={values.medication === true}
                                                            onChange={() => setFieldValue('medication', true)} disabled={source === 'r'} />
                                                        <span className="peer-checked:text-info">Yes</span>
                                                    </label>
                                                    <label className="inline-flex">
                                                        <input type="radio" name="square_text_radio" className="form-radio text-secondary rounded-none peer" checked={values.medication === false}
                                                            onChange={() => setFieldValue('medication', false)} disabled={source === 'r'} />
                                                        <span className="peer-checked:text-secondary">No</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {
                                                !readOnly && (
                                                    <div className="mt-3 sm:col-span-2">
                                                        <button type="submit" className="btn btn-primary">
                                                            Save
                                                        </button>
                                                    </div>)
                                            }

                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )
                    }

                </Formik>
                {
                    readOnly && <KycUserTicketsInfo userTickets={userTickets} summaryArray={summaryArray} />
                }

            </div>
        </div >
    );
};

export default KycActionPage;

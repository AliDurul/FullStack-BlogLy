'use client'
import Link from 'next/link';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@/lib/hooks';
import { selectIsDarkMode, selectRtlClass } from '@/lib/features/themeConfig/themeConfigSlice';
import Dropdown from '@/app/components/Layout/Dropdown';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const DashboardMain = () => {

    const isDark = useAppSelector(selectIsDarkMode)
    const isRtl = useAppSelector(selectRtlClass) === 'rtl' ? true : false;

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    });

    //Revenue Chart
    const revenueChart: any = {
        series: [
            {
                name: 'Income',
                data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
            },
            {
                name: 'Expenses',
                data: [16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000],
            },
        ],
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196F3', '#E7515A'] : ['#1B55E2', '#E7515A'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#E7515A',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value / 1000 + 'K';
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };

    //Sales By Category
    const salesByCategory: any = {
        series: [985, 737, 270],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Apparel', 'Sports', 'Others'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    // totalVisitOptions
    const totalVisit: any = {
        series: [{ data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25] }],
        options: {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#009688',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#009688'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
        },
    };
    // paidVisitOptions
    const paidVisit: any = {
        series: [{ data: [22, 19, 30, 47, 32, 44, 34, 55, 41, 69] }],
        options: {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#e2a03f',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e2a03f'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
        },
    };
    // uniqueVisitorSeriesOptions
    const uniqueVisitorSeries: any = {
        series: [
            {
                name: 'Direct',
                data: [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63],
            },
            {
                name: 'Organic',
                data: [91, 76, 85, 101, 98, 87, 105, 91, 114, 94, 66, 70],
            },
        ],
        options: {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#5c1ac3', '#ffbb44'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 8,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
            },
        },
    };
    // followersOptions
    const followers: any = {
        series: [
            {
                data: [38, 60, 38, 52, 36, 40, 28],
            },
        ],
        options: {
            chart: {
                height: 160,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#4361ee'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
        },
    };
    // referralOptions
    const referral: any = {
        series: [
            {
                data: [60, 28, 52, 38, 40, 36, 38],
            },
        ],
        options: {
            chart: {
                height: 160,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e7515a'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
        },
    };
    // engagementOptions
    const engagement: any = {
        series: [
            {
                name: 'Sales',
                data: [28, 50, 36, 60, 38, 52, 38],
            },
        ],
        options: {
            chart: {
                height: 160,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#1abc9c'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
        },
    };

    return (

        <div className="pt-5">
            <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
                <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Users Visit</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> $170.46 </div>
                        <div className="badge bg-white/30">+ 2.35% </div>
                    </div>
                    <div className="mt-5 flex items-center font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:mr-2 rtl:ml-2">
                            <path
                                opacity="0.5"
                                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Last Week 44,700
                    </div>
                </div>

                {/* Sessions */}
                <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Sessions</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 74,137 </div>
                        <div className="badge bg-white/30">- 2.35% </div>
                    </div>
                    <div className="mt-5 flex items-center font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:mr-2 rtl:ml-2">
                            <path
                                opacity="0.5"
                                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Last Week 84,709
                    </div>
                </div>

                {/*  Time On-Site */}
                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Time On-Site</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 38,085 </div>
                        <div className="badge bg-white/30">+ 1.35% </div>
                    </div>
                    <div className="mt-5 flex items-center font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:mr-2 rtl:ml-2">
                            <path
                                opacity="0.5"
                                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Last Week 37,894
                    </div>
                </div>

                {/* Bounce Rate */}
                <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Bounce Rate</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 49.10% </div>
                        <div className="badge bg-white/30">- 0.35% </div>
                    </div>
                    <div className="mt-5 flex items-center font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:mr-2 rtl:ml-2">
                            <path
                                opacity="0.5"
                                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Last Week 50.01%
                    </div>
                </div>
            </div>

            <div className="mb-6 grid gap-6 xl:grid-cols-3">
                <div className="panel h-full xl:col-span-2">
                    <div className="mb-5 flex items-center justify-between dark:text-white-light">
                        <h5 className="text-lg font-semibold">Revenue</h5>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 1]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                button={
                                    <svg className="h-5 w-5 text-black/70 hover:!text-primary dark:text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul>
                                    <li>
                                        <button type="button">Weekly</button>
                                    </li>
                                    <li>
                                        <button type="button">Monthly</button>
                                    </li>
                                    <li>
                                        <button type="button">Yearly</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <p className="text-lg dark:text-white-light/90">
                        Total Profit <span className="ml-2 text-primary">$10,840</span>
                    </p>
                    <div className="relative">
                        <div className="rounded-lg bg-white dark:bg-black">
                            {isMounted ? (
                                <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} width={'100%'} />
                            ) : (
                                <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                    <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="panel h-full">
                    <div className="mb-5 flex items-center">
                        <h5 className="text-lg font-semibold dark:text-white-light">Sales By Category</h5>
                    </div>
                    <div>
                        <div className="rounded-lg bg-white dark:bg-black">
                            {isMounted ? (
                                <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} width={'100%'} />
                            ) : (
                                <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                    <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="panel h-full sm:col-span-2 lg:col-span-1">
                    {/* statistics */}
                    <div className="mb-5 flex justify-between dark:text-white-light">
                        <h5 className="text-lg font-semibold ">Statistics</h5>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 text-black/70 hover:!text-primary dark:text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul>
                                    <li>
                                        <button type="button">This Week</button>
                                    </li>
                                    <li>
                                        <button type="button">Last Week</button>
                                    </li>
                                    <li>
                                        <button type="button">This Month</button>
                                    </li>
                                    <li>
                                        <button type="button">Last Month</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2">
                        <div>
                            <div>
                                <div>Total Visits</div>
                                <div className="text-lg text-[#f8538d]">423,964</div>
                            </div>
                            {isMounted && <ReactApexChart series={totalVisit.series} options={totalVisit.options} type="line" height={58} width={'100%'} />}
                        </div>

                        <div>
                            <div>
                                <div>Paid Visits</div>
                                <div className="text-lg text-[#f8538d]">7,929</div>
                            </div>

                            {isMounted && <ReactApexChart series={paidVisit.series} options={paidVisit.options} type="line" height={58} width={'100%'} />}
                        </div>
                    </div>
                </div>

                <div className="panel h-full">
                    <div className="mb-5 flex justify-between dark:text-white-light">
                        <h5 className="text-lg font-semibold ">Expenses</h5>

                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 text-black/70 hover:!text-primary dark:text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul>
                                    <li>
                                        <button type="button">This Week</button>
                                    </li>
                                    <li>
                                        <button type="button">Last Week</button>
                                    </li>
                                    <li>
                                        <button type="button">This Month</button>
                                    </li>
                                    <li>
                                        <button type="button">Last Month</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className=" my-10 text-3xl font-bold text-[#e95f2b]">
                        <span>$ 45,141 </span>
                        <span className="text-sm text-black ltr:mr-2 rtl:ml-2 dark:text-white-light">this week</span>
                        <svg className="inline text-success" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                opacity="0.5"
                                d="M22 7L14.6203 14.3347C13.6227 15.3263 13.1238 15.822 12.5051 15.822C11.8864 15.8219 11.3876 15.326 10.3902 14.3342L10.1509 14.0962C9.15254 13.1035 8.65338 12.6071 8.03422 12.6074C7.41506 12.6076 6.91626 13.1043 5.91867 14.0977L2 18"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path d="M22.0001 12.5458V7H16.418" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="h-5 w-full overflow-hidden rounded-full bg-dark-light p-1 shadow-3xl dark:bg-dark-light/10 dark:shadow-none">
                            <div
                                className="relative h-full w-full rounded-full bg-gradient-to-r from-[#4361ee] to-[#805dca] before:absolute before:inset-y-0 before:m-auto before:h-2 before:w-2 before:rounded-full before:bg-white ltr:before:right-0.5 rtl:before:left-0.5"
                                style={{ width: '65%' }}
                            ></div>
                        </div>
                        <span className="ltr:ml-5 rtl:mr-5 dark:text-white-light">57%</span>
                    </div>
                </div>

                {/* <div
                    className="panel grid h-full grid-cols-1 content-between overflow-hidden before:absolute before:-right-44 before:top-0 before:bottom-0 before:m-auto before:h-96 before:w-96 before:rounded-full before:bg-[#1937cc]"
                    style={{
                        background: 'linear-gradient(0deg,#00c6fb -227%,#005bea)',
                    }}
                >
               
                  
                </div> */}
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-3">
                <div className="panel h-full p-0 lg:col-span-2">
                    <div className="mb-5 flex items-start justify-between border-b border-white-light p-5  dark:border-[#1b2e4b] dark:text-white-light">
                        <h5 className="text-lg font-semibold ">Unique Visitors</h5>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 text-black/70 hover:!text-primary dark:text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul>
                                    <li>
                                        <button type="button">View</button>
                                    </li>
                                    <li>
                                        <button type="button">Update</button>
                                    </li>
                                    <li>
                                        <button type="button">Delete</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>

                    {isMounted && <ReactApexChart options={uniqueVisitorSeries.options} series={uniqueVisitorSeries.series} type="bar" height={360} width={'100%'} />}
                </div>

                <div className="panel h-full">
                    {/* <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Recent Activities</h5> */
                        <div className="-mx-5 mb-5 flex items-start justify-between border-b border-white-light p-5 pt-0  dark:border-[#1b2e4b] dark:text-white-light">
                            <h5 className="text-lg font-semibold ">Recent Activities</h5>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="hover:text-primary"
                                    button={
                                        <svg className="h-5 w-5 text-black/70 hover:!text-primary dark:text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                            <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                            <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                    }
                                >
                                    <ul>
                                        <li>
                                            <button type="button">View All</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>}
                    <PerfectScrollbar className="relative -mr-3 mb-4 h-[286px] pr-3">
                        <div className="cursor-pointer text-sm">
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Updated Server Logs</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">Just Now</div>

                                <span className="badge badge-outline-primary absolute bg-primary-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    Pending
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-success ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Send Mail to HR and Admin</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">2 min ago</div>

                                <span className="badge badge-outline-success absolute bg-success-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    Completed
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-danger ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Backup Files EOD</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">14:00</div>

                                <span className="badge badge-outline-danger absolute bg-danger-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    Pending
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-black ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Collect documents from Sara</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">16:00</div>

                                <span className="badge badge-outline-dark absolute bg-dark-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    Completed
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-warning ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Conference call with Marketing Manager.</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">17:00</div>

                                <span className="badge badge-outline-warning absolute bg-warning-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    In progress
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-info ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Rebooted Server</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">17:00</div>

                                <span className="badge badge-outline-info absolute bg-info-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    Completed
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-secondary ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Send contract details to Freelancer</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">18:00</div>

                                <span className="badge badge-outline-secondary absolute bg-secondary-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    Pending
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Updated Server Logs</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">Just Now</div>

                                <span className="badge badge-outline-primary absolute bg-primary-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    Pending
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-success ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Send Mail to HR and Admin</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">2 min ago</div>

                                <span className="badge badge-outline-success absolute bg-success-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    Completed
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-danger ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Backup Files EOD</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">14:00</div>

                                <span className="badge badge-outline-danger absolute bg-danger-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    Pending
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-black ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Collect documents from Sara</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">16:00</div>

                                <span className="badge badge-outline-dark absolute bg-dark-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    Completed
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-warning ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Conference call with Marketing Manager.</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">17:00</div>

                                <span className="badge badge-outline-warning absolute bg-warning-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    In progress
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-info ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Rebooted Server</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">17:00</div>

                                <span className="badge badge-outline-info absolute bg-info-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    Completed
                                </span>
                            </div>
                            <div className="group relative flex items-center py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-secondary ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">Send contract details to Freelancer</div>
                                <div className="text-xs text-white-dark ltr:ml-auto rtl:mr-auto dark:text-gray-500">18:00</div>

                                <span className="badge badge-outline-secondary absolute bg-secondary-light text-xs opacity-0 group-hover:opacity-100 ltr:right-0 rtl:left-0 dark:bg-black">
                                    Pending
                                </span>
                            </div>
                        </div>
                    </PerfectScrollbar>
                    <div className="border-t border-white-light dark:border-white/10">
                        <button type="button" className="group group flex w-full items-center justify-center p-4 font-semibold hover:text-primary">
                            View All
                            <svg
                                className="h-4 w-4 transition duration-300 group-hover:translate-x-1 ltr:ml-1 rtl:mr-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>

            <div className="mb-6 grid gap-6 sm:grid-cols-3 xl:grid-cols-5">
                <div className="panel h-full sm:col-span-3 xl:col-span-2">
                    <div className="mb-5 flex items-start justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Visitors by Browser</h5>
                    </div>
                    <div className="flex flex-col space-y-5">
                        <div className="flex items-center">
                            <div className="h-9 w-9">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary dark:text-white-light">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <circle opacity="0.5" cx="12" cy="12" r="4"></circle>
                                        <line opacity="0.5" x1="21.17" y1="8" x2="12" y2="8"></line>
                                        <line opacity="0.5" x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                                        <line opacity="0.5" x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                                    </svg>
                                </div>
                            </div>
                            <div className="w-full flex-initial px-3">
                                <div className="w-summary-info mb-1 flex justify-between font-semibold text-white-dark">
                                    <h6>Chrome</h6>
                                    <p className="text-xs ltr:ml-auto rtl:mr-auto">65%</p>
                                </div>
                                <div>
                                    <div className="h-5 w-full overflow-hidden rounded-full bg-dark-light p-1 shadow-3xl dark:bg-dark-light/10 dark:shadow-none">
                                        <div
                                            className="relative h-full w-full rounded-full bg-gradient-to-r from-[#009ffd] to-[#2a2a72] before:absolute before:inset-y-0 before:m-auto before:h-2 before:w-2 before:rounded-full before:bg-white ltr:before:right-0.5 rtl:before:left-0.5"
                                            style={{ width: '65%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="h-9 w-9">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger/10 text-danger dark:bg-danger dark:text-white-light">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                        <path
                                            d="M13.024 14.5601C10.7142 15.484 9.5593 15.946 8.89964 15.4977C8.74324 15.3914 8.60834 15.2565 8.50206 15.1001C8.0538 14.4405 8.51575 13.2856 9.43967 10.9758C9.63673 10.4831 9.73527 10.2368 9.90474 10.0435C9.94792 9.99429 9.99429 9.94792 10.0435 9.90474C10.2368 9.73527 10.4831 9.63673 10.9758 9.43966C13.2856 8.51575 14.4405 8.0538 15.1001 8.50206C15.2565 8.60834 15.3914 8.74324 15.4977 8.89964C15.946 9.5593 15.484 10.7142 14.5601 13.024C14.363 13.5166 14.2645 13.763 14.095 13.9562C14.0518 14.0055 14.0055 14.0518 13.9562 14.095C13.763 14.2645 13.5166 14.363 13.024 14.5601Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-full flex-initial px-3">
                                <div className="w-summary-info mb-1 flex justify-between font-semibold text-white-dark">
                                    <h6>Safari</h6>
                                    <p className="text-xs ltr:ml-auto rtl:mr-auto">40%</p>
                                </div>
                                <div>
                                    <div className="h-5 w-full overflow-hidden rounded-full bg-dark-light p-1 shadow-3xl dark:bg-dark-light/10 dark:shadow-none">
                                        <div
                                            className="relative h-full w-full rounded-full bg-gradient-to-r from-[#a71d31] to-[#3f0d12] before:absolute before:inset-y-0 before:m-auto before:h-2 before:w-2 before:rounded-full before:bg-white ltr:before:right-0.5 rtl:before:left-0.5"
                                            style={{ width: '40%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="h-9 w-9">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10 text-warning dark:bg-warning dark:text-white-light">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            opacity="0.5"
                                            d="M2 12H22M16 12C16 13.3132 15.8965 14.6136 15.6955 15.8268C15.4945 17.0401 15.1999 18.1425 14.8284 19.0711C14.457 19.9997 14.016 20.7362 13.5307 21.2388C13.0454 21.7413 12.5253 22 12 22C11.4747 22 10.9546 21.7413 10.4693 21.2388C9.98396 20.7362 9.54301 19.9997 9.17157 19.0711C8.80014 18.1425 8.5055 17.0401 8.30448 15.8268C8.10346 14.6136 8 13.3132 8 12C8 10.6868 8.10346 9.38642 8.30448 8.17316C8.5055 6.95991 8.80014 5.85752 9.17157 4.92893C9.54301 4.00035 9.98396 3.26375 10.4693 2.7612C10.9546 2.25866 11.4747 2 12 2C12.5253 2 13.0454 2.25866 13.5307 2.76121C14.016 3.26375 14.457 4.00035 14.8284 4.92893C15.1999 5.85752 15.4945 6.95991 15.6955 8.17317C15.8965 9.38642 16 10.6868 16 12Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M22 12C22 13.3132 21.7413 14.6136 21.2388 15.8268C20.7362 17.0401 19.9997 18.1425 19.0711 19.0711C18.1425 19.9997 17.0401 20.7362 15.8268 21.2388C14.6136 21.7413 13.3132 22 12 22C10.6868 22 9.38642 21.7413 8.17317 21.2388C6.95991 20.7362 5.85752 19.9997 4.92893 19.0711C4.00035 18.1425 3.26375 17.0401 2.7612 15.8268C2.25866 14.6136 2 13.3132 2 12C2 10.6868 2.25866 9.38642 2.76121 8.17316C3.26375 6.95991 4.00035 5.85752 4.92893 4.92893C5.85752 4.00035 6.95991 3.26375 8.17317 2.7612C9.38642 2.25866 10.6868 2 12 2C13.3132 2 14.6136 2.25866 15.8268 2.76121C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12L22 12Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-full flex-initial px-3">
                                <div className="w-summary-info mb-1 flex justify-between font-semibold text-white-dark">
                                    <h6>Others</h6>
                                    <p className="text-xs ltr:ml-auto rtl:mr-auto">25%</p>
                                </div>
                                <div>
                                    <div className="h-5 w-full overflow-hidden rounded-full bg-dark-light p-1 shadow-3xl dark:bg-dark-light/10 dark:shadow-none">
                                        <div
                                            className="relative h-full w-full rounded-full bg-gradient-to-r from-[#fe5f75] to-[#fc9842] before:absolute before:inset-y-0 before:m-auto before:h-2 before:w-2 before:rounded-full before:bg-white ltr:before:right-0.5 rtl:before:left-0.5"
                                            style={{ width: '25%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel h-full p-0">
                    <div className="flex p-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary dark:text-white-light">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                <path opacity="0.5" d="M18 9C19.6569 9 21 7.88071 21 6.5C21 5.11929 19.6569 4 18 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path opacity="0.5" d="M6 9C4.34315 9 3 7.88071 3 6.5C3 5.11929 4.34315 4 6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <ellipse cx="12" cy="17" rx="6" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                <path opacity="0.5" d="M20 19C21.7542 18.6153 23 17.6411 23 16.5C23 15.3589 21.7542 14.3847 20 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path opacity="0.5" d="M4 19C2.24575 18.6153 1 17.6411 1 16.5C1 15.3589 2.24575 14.3847 4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="font-semibold ltr:ml-3 rtl:mr-3">
                            <p className="text-xl dark:text-white-light">31.6K</p>
                            <h5 className="text-xs text-[#506690]">Followers</h5>
                        </div>
                    </div>
                    <div className="h-40">
                        {isMounted && <ReactApexChart series={followers.series} options={followers.options} type="area" height={160} width={'100%'} className="absolute bottom-0 w-full" />}
                    </div>
                </div>

                <div className="panel h-full p-0">
                    <div className="flex p-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger dark:bg-danger dark:text-white-light">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.0464 14C8.54044 12.4882 8.67609 9.90087 10.3494 8.22108L15.197 3.35462C16.8703 1.67483 19.4476 1.53865 20.9536 3.05046C22.4596 4.56228 22.3239 7.14956 20.6506 8.82935L18.2268 11.2626"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <path
                                    opacity="0.5"
                                    d="M13.9536 10C15.4596 11.5118 15.3239 14.0991 13.6506 15.7789L11.2268 18.2121L8.80299 20.6454C7.12969 22.3252 4.55237 22.4613 3.0464 20.9495C1.54043 19.4377 1.67609 16.8504 3.34939 15.1706L5.77323 12.7373"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <div className="font-semibold ltr:ml-3 rtl:mr-3">
                            <p className="text-xl dark:text-white-light">1,900</p>
                            <h5 className="text-xs text-[#506690]">Referral</h5>
                        </div>
                    </div>
                    <div className="h-40">
                        {isMounted && <ReactApexChart series={referral.series} options={referral.options} type="area" height={160} width={'100%'} className="absolute bottom-0 w-full" />}
                    </div>
                </div>

                <div className="panel h-full p-0">
                    <div className="flex p-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success dark:bg-success dark:text-white-light">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10 22C14.4183 22 18 18.4183 18 14C18 9.58172 14.4183 6 10 6C5.58172 6 2 9.58172 2 14C2 15.2355 2.28008 16.4056 2.7802 17.4502C2.95209 17.8093 3.01245 18.2161 2.90955 18.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L5.39939 21.0904C5.78393 20.9876 6.19071 21.0479 6.54976 21.2198C7.5944 21.7199 8.76449 22 10 22Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <path
                                    opacity="0.5"
                                    d="M18 14.5018C18.0665 14.4741 18.1324 14.4453 18.1977 14.4155C18.5598 14.2501 18.9661 14.1882 19.3506 14.2911L19.8267 14.4185C20.793 14.677 21.677 13.793 21.4185 12.8267L21.2911 12.3506C21.1882 11.9661 21.2501 11.5598 21.4155 11.1977C21.7908 10.376 22 9.46242 22 8.5C22 4.91015 19.0899 2 15.5 2C12.7977 2 10.4806 3.64899 9.5 5.9956"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <g opacity="0.5">
                                    <path
                                        d="M7.5 14C7.5 14.5523 7.05228 15 6.5 15C5.94772 15 5.5 14.5523 5.5 14C5.5 13.4477 5.94772 13 6.5 13C7.05228 13 7.5 13.4477 7.5 14Z"
                                        fill="currentColor"
                                    />
                                    <path d="M11 14C11 14.5523 10.5523 15 10 15C9.44772 15 9 14.5523 9 14C9 13.4477 9.44772 13 10 13C10.5523 13 11 13.4477 11 14Z" fill="currentColor" />
                                    <path
                                        d="M14.5 14C14.5 14.5523 14.0523 15 13.5 15C12.9477 15 12.5 14.5523 12.5 14C12.5 13.4477 12.9477 13 13.5 13C14.0523 13 14.5 13.4477 14.5 14Z"
                                        fill="currentColor"
                                    />
                                </g>
                            </svg>
                        </div>
                        <div className="font-semibold ltr:ml-3 rtl:mr-3">
                            <p className="text-xl dark:text-white-light">18.2%</p>
                            <h5 className="text-xs text-[#506690]">Engagement</h5>
                        </div>
                    </div>
                    <div className="h-40">
                        {isMounted && <ReactApexChart series={engagement.series} options={engagement.options} type="area" height={160} width={'100%'} className="absolute bottom-0 w-full" />}
                    </div>
                </div>
            </div>

        </div>

    );
};

export default DashboardMain

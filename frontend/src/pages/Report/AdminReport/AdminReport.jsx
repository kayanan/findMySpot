import React, { useState, useEffect } from 'react';
import {
    FaChartBar,
    FaUsers,
    FaMoneyBillWave,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaDownload,
    FaFilter,
    FaEye,
    FaPrint,
    FaFileExport,
    FaGlobe,
    FaBuilding,
    FaUserTie,
    FaUser,
    FaCar,
    FaParking,
    FaCreditCard,
    FaStar,
    FaPhone,
    FaEnvelope
} from 'react-icons/fa';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    ComposedChart
} from 'recharts';
import {
    fetchRevenueByRegion,
    fetchReservationsRevenueByCity,
    fetchRevenueByParkingOwners,
    fetchSubscriptionPayments,
    exportRevenueByRegionCSV,
    exportReservationsRevenueByCityCSV,
    exportRevenueByParkingOwnersCSV,
    exportSubscriptionPaymentsCSV
} from '../../../services/report.service';

const AdminReport = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState('month');
    const [selectedReport, setSelectedReport] = useState('revenue');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [revenueByRegion, setRevenueByRegion] = useState([]);
    const [revenueSummary, setRevenueSummary] = useState(null);
    const [loadingRevenue, setLoadingRevenue] = useState(false);
    const [revenueError, setRevenueError] = useState(null);

    // Reservations revenue by city state
    const [reservationsByCity, setReservationsByCity] = useState([]);
    const [reservationsSummary, setReservationsSummary] = useState(null);
    const [loadingReservations, setLoadingReservations] = useState(false);
    const [reservationsError, setReservationsError] = useState(null);

    // Revenue by parking owners state
    const [parkingOwnersRevenue, setParkingOwnersRevenue] = useState([]);
    const [parkingOwnersSummary, setParkingOwnersSummary] = useState(null);
    const [loadingParkingOwners, setLoadingParkingOwners] = useState(false);
    const [parkingOwnersError, setParkingOwnersError] = useState(null);

    // Subscription payments state
    const [subscriptionPayments, setSubscriptionPayments] = useState([]);
    const [subscriptionPaymentsSummary, setSubscriptionPaymentsSummary] = useState(null);
    const [loadingSubscriptionPayments, setLoadingSubscriptionPayments] = useState(false);
    const [subscriptionPaymentsError, setSubscriptionPaymentsError] = useState(null);

    // Set default date range to current month
    useEffect(() => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        setStartDate(firstDay.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
    }, []);

    // Fetch revenue by region when date changes or on mount
    useEffect(() => {
        if (!startDate || !endDate) return;
        setLoadingRevenue(true);
        setRevenueError(null);
        fetchRevenueByRegion(
            new Date(startDate).toISOString(),
            new Date(endDate).toISOString()
        )
            .then((data) => {
                setRevenueByRegion(
                    (data.data || []).map(region => ({
                        region: region.provinceName,
                        revenue: region.totalRevenue,
                        bookings: region.totalBookings,
                        parkingAreas: region.totalParkingAreas,
                        growth: region.growthPercentage
                    }))
                );
                setRevenueSummary(data.summary || null);
            })
            .catch((err) => {
                setRevenueError(err?.response?.data?.message || 'Failed to fetch revenue data');
            })
            .finally(() => setLoadingRevenue(false));
    }, [startDate, endDate]);

    // Fetch reservations revenue by city when date changes or on mount
    useEffect(() => {
        if (!startDate || !endDate) return;
        setLoadingReservations(true);
        setReservationsError(null);
        fetchReservationsRevenueByCity(
            new Date(startDate).toISOString(),
            new Date(endDate).toISOString()
        )
            .then((data) => {
                setReservationsByCity(
                    (data.data || []).map(city => ({
                        city: city.cityName,
                        district: city.districtName,
                        province: city.provinceName,
                        reservations: city.totalReservations,
                        revenue: city.totalRevenue,
                        averageRevenue: city.averageRevenuePerReservation
                    }))
                );
                setReservationsSummary(data.summary || null);
            })
            .catch((err) => {
                setReservationsError(err?.response?.data?.message || 'Failed to fetch reservations data');
            })
            .finally(() => setLoadingReservations(false));
    }, [startDate, endDate]);

    // Fetch revenue by parking owners when date changes or on mount
    useEffect(() => {
        if (!startDate || !endDate) return;
        setLoadingParkingOwners(true);
        setParkingOwnersError(null);
        fetchRevenueByParkingOwners(
            new Date(startDate).toISOString(),
            new Date(endDate).toISOString()
        )
            .then((data) => {
                setParkingOwnersRevenue(
                    (data.data || []).map(owner => ({
                        ownerId: owner.ownerId,
                        ownerName: owner.ownerName,
                        ownerEmail: owner.ownerEmail,
                        ownerContact: owner.ownerContact,
                        parkingAreas: owner.parkingAreas,
                        totalRevenue: owner.totalRevenue,
                        totalBookings: owner.totalBookings,
                        totalParkingAreas: owner.totalParkingAreas,
                        averageRevenuePerParkingArea: owner.averageRevenuePerParkingArea
                    }))
                );
                setParkingOwnersSummary(data.summary || null);
            })
            .catch((err) => {
                setParkingOwnersError(err?.response?.data?.message || 'Failed to fetch parking owners data');
            })
            .finally(() => setLoadingParkingOwners(false));
    }, [startDate, endDate]);

    // Fetch subscription payments when date changes or on mount
    useEffect(() => {
        if (!startDate || !endDate) return;
        setLoadingSubscriptionPayments(true);
        setSubscriptionPaymentsError(null);
        fetchSubscriptionPayments(
            new Date(startDate).toISOString(),
            new Date(endDate).toISOString()
        )
            .then((data) => {
                setSubscriptionPayments(
                    (data.data || []).map(payment => ({
                        paymentId: payment.paymentId,
                        ownerId: payment.ownerId,
                        ownerName: payment.ownerName,
                        ownerEmail: payment.ownerEmail,
                        ownerContact: payment.ownerContact,
                        parkingAreaId: payment.parkingAreaId,
                        parkingAreaName: payment.parkingAreaName,
                        amount: payment.amount,
                        status: payment.status,
                        paymentMethod: payment.paymentMethod,
                        paymentDate: new Date(payment.paymentDate),
                        subscriptionStartDate: new Date(payment.subscriptionStartDate),
                        subscriptionEndDate: new Date(payment.subscriptionEndDate),
                        subscriptionPeriod: payment.subscriptionPeriod,
                        paymentReference: payment.paymentReference,
                        paymentGateway: payment.paymentGateway
                    }))
                );
                setSubscriptionPaymentsSummary(data.summary || null);
            })
            .catch((err) => {
                setSubscriptionPaymentsError(err?.response?.data?.message || 'Failed to fetch subscription payments data');
            })
            .finally(() => setLoadingSubscriptionPayments(false));
    }, [startDate, endDate]);


   

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('si-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('si-LK').format(number);
    };

    const getGrowthColor = (growth) => {
        return growth >= 0 ? 'text-green-600' : 'text-red-600';
    };

    const getGrowthIcon = (growth) => {
        return growth >= 0 ? <FaDownload className="text-green-500" /> : <FaDownload className="text-red-500" />;
    };

    // CSV Export functionality
    const handleExportReport = async () => {
        if (!startDate || !endDate) {
            alert('Please select a date range before exporting');
            return;
        }

        try {
            let csvData;
            let fileName;

            switch (selectedReport) {
                case 'revenue':
                    csvData = await exportRevenueByRegionCSV(
                        new Date(startDate).toISOString(),
                        new Date(endDate).toISOString()
                    );
                    fileName = `revenue_by_region_${startDate}_${endDate}.csv`;
                    break;
                case 'reservations':
                    csvData = await exportReservationsRevenueByCityCSV(
                        new Date(startDate).toISOString(),
                        new Date(endDate).toISOString()
                    );
                    fileName = `reservations_revenue_by_city_${startDate}_${endDate}.csv`;
                    break;
                case 'owners':
                    csvData = await exportRevenueByParkingOwnersCSV(
                        new Date(startDate).toISOString(),
                        new Date(endDate).toISOString()
                    );
                    fileName = `revenue_by_parking_owners_${startDate}_${endDate}.csv`;
                    break;
                case 'subscriptions':
                    csvData = await exportSubscriptionPaymentsCSV(
                        new Date(startDate).toISOString(),
                        new Date(endDate).toISOString()
                    );
                    fileName = `subscription_payments_${startDate}_${endDate}.csv`;
                    break;
                default:
                    alert('Please select a report type to export');
                    return;
            }

            // Create download link
            const url = window.URL.createObjectURL(new Blob([csvData]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export report. Please try again.');
        }
    };

    const reports = [
        { id: 'revenue', label: 'Revenue by Region', icon: FaMoneyBillWave },
        { id: 'reservations', label: 'Reservations by Location', icon: FaMapMarkerAlt },
        { id: 'owners', label: 'Revenue by Owners', icon: FaBuilding },
        { id: 'subscriptions', label: 'Subscription Payments', icon: FaCreditCard }
    ];

    const timeRanges = [
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
        { id: 'quarter', label: 'This Quarter' },
        { id: 'year', label: 'This Year' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Admin Reports & Analytics
                        </h1>
                        <p className="text-gray-600">
                            Comprehensive insights into system performance and user activity
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleExportReport}
                            className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center space-x-2 transition-colors"
                        >
                            <FaDownload />
                            <span>Export Report</span>
                        </button>
                       
                    </div>
                </div>
            </div>

            {/* Report Type Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Report Type</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {reports.map((report) => (
                            <button
                                key={report.id}
                                onClick={() => setSelectedReport(report.id)}
                                className={`p-4 rounded-lg border-2 transition-all ${selectedReport === report.id
                                        ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <report.icon className="text-xl" />
                                    <span className="font-medium">{report.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Range Filter */}
                <div className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <h3 className="text-md font-medium text-gray-900">Time Range</h3>
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                            {/* Date Range Inputs */}
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                <div className="flex flex-col">
                                    <label className="text-xs font-medium text-gray-600 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-medium text-gray-600 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Quick Date Buttons */}
                            <div className="flex space-x-2">
                                {timeRanges.map((range) => (
                                    <button
                                        key={range.id}
                                        onClick={() => {
                                            setSelectedTimeRange(range.id);
                                            // Set date range based on selection
                                            const now = new Date();
                                            let start, end;

                                            switch (range.id) {
                                                case 'week':
                                                    start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                                                    end = now;
                                                    break;
                                                case 'month':
                                                    start = new Date(now.getFullYear(), now.getMonth(), 1);
                                                    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                                                    break;
                                                case 'quarter':
                                                    const quarter = Math.floor(now.getMonth() / 3);
                                                    start = new Date(now.getFullYear(), quarter * 3, 1);
                                                    end = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
                                                    break;
                                                case 'year':
                                                    start = new Date(now.getFullYear(), 0, 1);
                                                    end = new Date(now.getFullYear(), 11, 31);
                                                    break;
                                                default:
                                                    start = new Date(now.getFullYear(), now.getMonth(), 1);
                                                    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                                            }

                                            setStartDate(start.toISOString().split('T')[0]);
                                            setEndDate(end.toISOString().split('T')[0]);
                                        }}
                                        className={`px-3 py-1 text-sm rounded-lg ${selectedTimeRange === range.id
                                                ? 'bg-cyan-100 text-cyan-700'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Date Range Display */}
                    {startDate && endDate && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <FaCalendarAlt className="text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        Showing data from <span className="font-medium">{new Date(startDate).toLocaleDateString()}</span> to <span className="font-medium">{new Date(endDate).toLocaleDateString()}</span>
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        setStartDate('');
                                        setEndDate('');
                                        setSelectedTimeRange('month');
                                    }}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Report Content */}
            <div className="space-y-6">
                {selectedReport === 'revenue' && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                        <p className="text-xl font-bold text-gray-900">{formatCurrency(3210000)}</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <FaMoneyBillWave className="text-green-600 text-lg" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-2 text-sm">
                                    <FaDownload className="text-green-500 mr-1" />
                                    <span className="text-green-600">+7.4% from last month</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                        <p className="text-xl font-bold text-gray-900">{formatNumber(3890)}</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <FaCar className="text-blue-600 text-lg" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-2 text-sm">
                                    <FaDownload className="text-green-500 mr-1" />
                                    <span className="text-green-600">+12.8% from last month</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Regions</p>
                                        <p className="text-xl font-bold text-gray-900">9</p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <FaGlobe className="text-purple-600 text-lg" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-2 text-sm">
                                    <FaDownload className="text-green-500 mr-1" />
                                    <span className="text-green-600">+2 new regions</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Avg. Revenue/Booking</p>
                                        <p className="text-xl font-bold text-gray-900">{formatCurrency(825)}</p>
                                    </div>
                                    <div className="p-3 bg-yellow-100 rounded-lg">
                                        <FaChartBar className="text-yellow-600 text-lg" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-2 text-sm">
                                    <FaDownload className="text-green-500 mr-1" />
                                    <span className="text-green-600">+5.2% from last month</span>
                                </div>
                            </div>
                        </div>

                        {/* Revenue by Province Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Revenue by Province</h3>
                            </div>
                            {loadingRevenue ? (
                                <div className="text-center py-10">Loading...</div>
                            ) : revenueError ? (
                                <div className="text-center text-red-500 py-10">{revenueError}</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={revenueByRegion}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="region" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value), 'Revenue']}
                                            labelStyle={{ color: '#374151' }}
                                        />
                                        <Bar dataKey="revenue" fill="#0891b2" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Revenue Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Revenue Breakdown</h3>
                            <div className="overflow-x-auto">
                                {loadingRevenue ? (
                                    <div className="text-center py-10">Loading...</div>
                                ) : revenueError ? (
                                    <div className="text-center text-red-500 py-10">{revenueError}</div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Province</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parking Areas</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {revenueByRegion.map((region, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{region.region}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatCurrency(region.revenue)}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{formatNumber(region.bookings)}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{region.parkingAreas}</td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            {getGrowthIcon(region.growth)}
                                                            <span className={`text-sm font-medium ${getGrowthColor(region.growth)}`}>
                                                                {region.growth}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            {/* Optionally show summary */}
                            {revenueSummary && (
                                <div className="mt-4 text-sm text-gray-700">
                                    <strong>Total Revenue:</strong> {formatCurrency(revenueSummary.totalRevenue)} | <strong>Total Bookings:</strong> {formatNumber(revenueSummary.totalBookings)} | <strong>Total Parking Areas:</strong> {formatNumber(revenueSummary.totalParkingAreas)} | <strong>Avg. Growth:</strong> {revenueSummary.averageGrowthPercentage}%
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {selectedReport === 'reservations' && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {loadingReservations ? '...' : formatNumber(reservationsSummary?.totalReservations || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <FaCar className="text-blue-600 text-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {loadingReservations ? '...' : formatCurrency(reservationsSummary?.totalRevenue || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <FaMoneyBillWave className="text-green-600 text-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Avg. Revenue/Reservation</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {loadingReservations ? '...' : formatCurrency(reservationsSummary?.averageRevenuePerReservation || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-yellow-100 rounded-lg">
                                        <FaChartBar className="text-yellow-600 text-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Cities</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {loadingReservations ? '...' : reservationsByCity.length}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <FaMapMarkerAlt className="text-purple-600 text-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reservations Revenue by City Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Reservations Revenue by City</h3>
                            </div>
                            {loadingReservations ? (
                                <div className="text-center py-10">Loading...</div>
                            ) : reservationsError ? (
                                <div className="text-center text-red-500 py-10">{reservationsError}</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={reservationsByCity}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="city" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value), 'Revenue']}
                                            labelStyle={{ color: '#374151' }}
                                        />
                                        <Bar dataKey="revenue" fill="#0891b2" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Reservations by City Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Reservations Breakdown</h3>
                            <div className="overflow-x-auto">
                                {loadingReservations ? (
                                    <div className="text-center py-10">Loading...</div>
                                ) : reservationsError ? (
                                    <div className="text-center text-red-500 py-10">{reservationsError}</div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Province</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservations</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Revenue</th>
            
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {reservationsByCity.map((city, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{city.city}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{city.district}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{city.province}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatNumber(city.reservations)}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatCurrency(city.revenue)}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatCurrency(city.averageRevenue)}</td>
                                                    
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            {/* Optionally show summary */}
                            {reservationsSummary && (
                                <div className="mt-4 text-sm text-gray-700">
                                    <strong>Total Reservations:</strong> {formatNumber(reservationsSummary.totalReservations)} | <strong>Total Revenue:</strong> {formatCurrency(reservationsSummary.totalRevenue)} | <strong>Avg. Revenue per Reservation:</strong> {formatCurrency(reservationsSummary.averageRevenuePerReservation)}
                                </div>
                            )}
                        </div>
                    </div>
                )}



                {selectedReport === 'owners' && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {loadingParkingOwners ? '...' : formatCurrency(parkingOwnersSummary?.totalRevenue || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <FaMoneyBillWave className="text-green-600 text-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Owners</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {loadingParkingOwners ? '...' : parkingOwnersSummary?.totalOwners || 0}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <FaBuilding className="text-blue-600 text-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {loadingParkingOwners ? '...' : formatNumber(parkingOwnersSummary?.totalBookings || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <FaCar className="text-purple-600 text-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Avg. Revenue/Owner</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {loadingParkingOwners ? '...' : formatCurrency(parkingOwnersSummary?.averageRevenuePerOwner || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-yellow-100 rounded-lg">
                                        <FaChartBar className="text-yellow-600 text-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Revenue by Owners Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Revenue by Parking Owners</h3>
                            </div>
                            {loadingParkingOwners ? (
                                <div className="text-center py-10">Loading...</div>
                            ) : parkingOwnersError ? (
                                <div className="text-center text-red-500 py-10">{parkingOwnersError}</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={parkingOwnersRevenue}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="ownerName" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value), 'Revenue']}
                                            labelStyle={{ color: '#374151' }}
                                        />
                                        <Bar dataKey="totalRevenue" fill="#0891b2" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Revenue by Owners Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Owner Breakdown</h3>
                            <div className="overflow-x-auto">
                                {loadingParkingOwners ? (
                                    <div className="text-center py-10">Loading...</div>
                                ) : parkingOwnersError ? (
                                    <div className="text-center text-red-500 py-10">{parkingOwnersError}</div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Bookings</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parking Areas</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Revenue/Area</th>
                                               
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {parkingOwnersRevenue.map((owner, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{owner.ownerName}</p>
                                                            <p className="text-xs text-gray-500">{owner.ownerId}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center space-x-1">
                                                                <FaPhone className="text-gray-400 w-3 h-3" />
                                                                <span className="text-xs">{owner.ownerContact}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <FaEnvelope className="text-gray-400 w-3 h-3" />
                                                                <span className="text-xs">{owner.ownerEmail}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatCurrency(owner.totalRevenue)}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{formatNumber(owner.totalBookings)}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{owner.totalParkingAreas}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatCurrency(owner.averageRevenuePerParkingArea)}</td>
                                                    
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            {/* Optionally show summary */}
                            {parkingOwnersSummary && (
                                <div className="mt-4 text-sm text-gray-700">
                                    <strong>Total Owners:</strong> {formatNumber(parkingOwnersSummary.totalOwners)} | <strong>Total Revenue:</strong> {formatCurrency(parkingOwnersSummary.totalRevenue)} | <strong>Total Bookings:</strong> {formatNumber(parkingOwnersSummary.totalBookings)} | <strong>Total Parking Areas:</strong> {formatNumber(parkingOwnersSummary.totalParkingAreas)} | <strong>Avg. Revenue per Owner:</strong> {formatCurrency(parkingOwnersSummary.averageRevenuePerOwner)}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {selectedReport === 'subscriptions' && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {loadingSubscriptionPayments ? '...' : formatCurrency(subscriptionPaymentsSummary?.totalAmount || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <FaMoneyBillWave className="text-green-600 text-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Payments</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {loadingSubscriptionPayments ? '...' : formatNumber(subscriptionPaymentsSummary?.totalPayments || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <FaCreditCard className="text-blue-600 text-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Success Rate</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {loadingSubscriptionPayments ? '...' : subscriptionPaymentsSummary ?
                                                Math.round((subscriptionPaymentsSummary.successfulPayments / subscriptionPaymentsSummary.totalPayments) * 100) : 0}%
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <FaChartBar className="text-purple-600 text-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Avg. Amount</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {loadingSubscriptionPayments ? '...' : formatCurrency(subscriptionPaymentsSummary?.averageAmount || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-yellow-100 rounded-lg">
                                        <FaMoneyBillWave className="text-yellow-600 text-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Status Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Distribution</h3>
                                {loadingSubscriptionPayments ? (
                                    <div className="text-center py-10">Loading...</div>
                                ) : subscriptionPaymentsError ? (
                                    <div className="text-center text-red-500 py-10">{subscriptionPaymentsError}</div>
                                ) : (
                                    <>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={(() => {
                                                        const statusCounts = {};
                                                        subscriptionPayments.forEach(payment => {
                                                            statusCounts[payment.status] = (statusCounts[payment.status] || 0) + 1;
                                                        });
                                                        const total = subscriptionPayments.length;
                                                        const colors = { 'SUCCESS': '#10b981', 'PENDING': '#f59e0b', 'FAILED': '#ef4444' };
                                                        return Object.entries(statusCounts).map(([status, count]) => ({
                                                            status,
                                                            count,
                                                            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
                                                            color: colors[status] || '#6b7280'
                                                        }));
                                                    })()}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="count"
                                                >
                                                    {(() => {
                                                        const statusCounts = {};
                                                        subscriptionPayments.forEach(payment => {
                                                            statusCounts[payment.status] = (statusCounts[payment.status] || 0) + 1;
                                                        });
                                                        const total = subscriptionPayments.length;
                                                        const colors = { 'SUCCESS': '#10b981', 'PENDING': '#f59e0b', 'FAILED': '#ef4444' };
                                                        return Object.entries(statusCounts).map(([status, count], index) => (
                                                            <Cell key={`cell-${index}`} fill={colors[status] || '#6b7280'} />
                                                        ));
                                                    })()}
                                                </Pie>
                                                <Tooltip formatter={(value, name) => [formatNumber(value), 'Payments']} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="mt-4 space-y-2">
                                            {(() => {
                                                const statusCounts = {};
                                                subscriptionPayments.forEach(payment => {
                                                    statusCounts[payment.status] = (statusCounts[payment.status] || 0) + 1;
                                                });
                                                const total = subscriptionPayments.length;
                                                const colors = { 'SUCCESS': '#10b981', 'PENDING': '#f59e0b', 'FAILED': '#ef4444' };
                                                return Object.entries(statusCounts).map(([status, count], index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[status] || '#6b7280' }}></div>
                                                            <span className="text-sm text-gray-600">{status}</span>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{count} ({total > 0 ? Math.round((count / total) * 100) : 0}%)</span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method Distribution</h3>
                                {loadingSubscriptionPayments ? (
                                    <div className="text-center py-10">Loading...</div>
                                ) : subscriptionPaymentsError ? (
                                    <div className="text-center text-red-500 py-10">{subscriptionPaymentsError}</div>
                                ) : (
                                    <>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={(() => {
                                                        const methodCounts = {};
                                                        subscriptionPayments.forEach(payment => {
                                                            methodCounts[payment.paymentMethod] = (methodCounts[payment.paymentMethod] || 0) + 1;
                                                        });
                                                        const total = subscriptionPayments.length;
                                                        const colors = { 'CARD': '#3b82f6', 'BANK_TRANSFER': '#10b981', 'MOBILE_PAYMENT': '#8b5cf6' };
                                                        return Object.entries(methodCounts).map(([method, count]) => ({
                                                            method,
                                                            count,
                                                            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
                                                            color: colors[method] || '#6b7280'
                                                        }));
                                                    })()}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="count"
                                                >
                                                    {(() => {
                                                        const methodCounts = {};
                                                        subscriptionPayments.forEach(payment => {
                                                            methodCounts[payment.paymentMethod] = (methodCounts[payment.paymentMethod] || 0) + 1;
                                                        });
                                                        const colors = { 'CARD': '#3b82f6', 'BANK_TRANSFER': '#10b981', 'MOBILE_PAYMENT': '#8b5cf6' };
                                                        return Object.entries(methodCounts).map(([method, count], index) => (
                                                            <Cell key={`cell-${index}`} fill={colors[method] || '#6b7280'} />
                                                        ));
                                                    })()}
                                                </Pie>
                                                <Tooltip formatter={(value, name) => [formatNumber(value), 'Payments']} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="mt-4 space-y-2">
                                            {(() => {
                                                const methodCounts = {};
                                                subscriptionPayments.forEach(payment => {
                                                    methodCounts[payment.paymentMethod] = (methodCounts[payment.paymentMethod] || 0) + 1;
                                                });
                                                const total = subscriptionPayments.length;
                                                const colors = { 'CARD': '#3b82f6', 'BANK_TRANSFER': '#10b981', 'MOBILE_PAYMENT': '#8b5cf6' };
                                                return Object.entries(methodCounts).map(([method, count], index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[method] || '#6b7280' }}></div>
                                                            <span className="text-sm text-gray-600">{method.replace('_', ' ')}</span>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{count} ({total > 0 ? Math.round((count / total) * 100) : 0}%)</span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Subscription Payments Trend */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Payments Trend</h3>
                            {loadingSubscriptionPayments ? (
                                <div className="text-center py-10">Loading...</div>
                            ) : subscriptionPaymentsError ? (
                                <div className="text-center text-red-500 py-10">{subscriptionPaymentsError}</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <ComposedChart data={(() => {
                                        // Group payments by month
                                        const monthlyData = {};
                                        subscriptionPayments.forEach(payment => {
                                            const month = payment.paymentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                            if (!monthlyData[month]) {
                                                monthlyData[month] = { month, payments: 0, revenue: 0 };
                                            }
                                            monthlyData[month].payments += 1;
                                            monthlyData[month].revenue += payment.amount;
                                        });

                                        // Convert to array and sort by date
                                        return Object.values(monthlyData).sort((a, b) => {
                                            const dateA = new Date(a.month);
                                            const dateB = new Date(b.month);
                                            return dateA - dateB;
                                        });
                                    })()}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" stroke="#6b7280" />
                                        <YAxis yAxisId="left" stroke="#6b7280" />
                                        <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                name === 'revenue' ? formatCurrency(value) : formatNumber(value),
                                                name === 'revenue' ? 'Revenue' : 'Payments'
                                            ]}
                                            labelStyle={{ color: '#374151' }}
                                        />
                                        <Bar yAxisId="left" dataKey="payments" fill="#0891b2" radius={[4, 4, 0, 0]} />
                                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Subscription Payments Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Payment Details</h3>
                            <div className="overflow-x-auto">
                                {loadingSubscriptionPayments ? (
                                    <div className="text-center py-10">Loading...</div>
                                ) : subscriptionPaymentsError ? (
                                    <div className="text-center text-red-500 py-10">{subscriptionPaymentsError}</div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parking Area</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription Period</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {subscriptionPayments.map((payment, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{payment.paymentId}</p>
                                                            <p className="text-xs text-gray-500">{payment.paymentReference}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{payment.ownerName}</p>
                                                            <p className="text-xs text-gray-500">{payment.ownerId}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">{payment.parkingAreaName}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${payment.status === 'SUCCESS'
                                                                ? 'bg-green-100 text-green-800'
                                                                : payment.status === 'PENDING'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {payment.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        <div className="flex items-center space-x-1">
                                                            {payment.paymentMethod === 'CARD' && <FaCreditCard className="text-blue-500" />}
                                                            {payment.paymentMethod === 'BANK_TRANSFER' && <FaBuilding className="text-green-500" />}
                                                            {payment.paymentMethod === 'MOBILE_PAYMENT' && <FaPhone className="text-purple-500" />}
                                                            <span className="text-xs">{payment.paymentMethod.replace('_', ' ')}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        {payment.paymentDate.toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        <div>
                                                            <p className="text-xs">From: {payment.subscriptionStartDate.toLocaleDateString()}</p>
                                                            <p className="text-xs">To: {payment.subscriptionEndDate.toLocaleDateString()}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button className="text-cyan-600 hover:text-cyan-900">
                                                                <FaEye />
                                                            </button>
                                                            <button className="text-blue-600 hover:text-blue-900">
                                                                <FaDownload />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            {/* Optionally show summary */}
                            {subscriptionPaymentsSummary && (
                                <div className="mt-4 text-sm text-gray-700">
                                    <strong>Total Payments:</strong> {formatNumber(subscriptionPaymentsSummary.totalPayments)} | <strong>Total Amount:</strong> {formatCurrency(subscriptionPaymentsSummary.totalAmount)} | <strong>Successful:</strong> {formatNumber(subscriptionPaymentsSummary.successfulPayments)} | <strong>Failed:</strong> {formatNumber(subscriptionPaymentsSummary.failedPayments)} | <strong>Pending:</strong> {formatNumber(subscriptionPaymentsSummary.pendingPayments)} | <strong>Avg. Amount:</strong> {formatCurrency(subscriptionPaymentsSummary.averageAmount)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReport;
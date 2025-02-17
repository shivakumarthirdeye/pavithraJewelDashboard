import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    DeleteIcon,
    Drop,
    EditIcon,
    ExportIcon,
    SearchIcon,
} from "../../svg";
import catStyle from "../category/category.module.css";
import { changeDateFormat } from "../../helper/dateConversions";
// import * as XLSX from "xlsx";
import ErrorPage from "../../component/ErrorPage";
import DeleteModal from "../../component/DeleteModal";
import CustomSeparator from "../../component/CustomizedBreadcrumb";
import { Box, Button, CircularProgress, MenuItem, Pagination, Select } from "@mui/material";
import productStyle from '../product/product.module.css'
import countryStyle from './country.module.css'
import { cancle, formselect, saveData } from "../../MaterialsUI";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { useFormik } from 'formik';
import * as yup from "yup";
import EditCountry from "./EditCountry";
import { useDispatch, useSelector } from "react-redux";
import { addCountry, deleteCountry, getAllCountry, getExportCountry, setFilterValues } from "../../redux/countrySlice";
import { formatDate } from "../../helper/FormatDate";
import * as XLSX from 'xlsx';

const Country = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    //state
    const [search, setSearch] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [datas, setData] = useState([]);
    const [order, setOrder] = useState('asc')

    const { countryData, filterOptions, isLoading, isRefresh } = useSelector(
        (state) => state.country
    );
    console.log('countryData', countryData);


    const schema = yup.object().shape({
        name: yup.string().required("Name is required"),
        status: yup.string().required("Status is required"),
    })

    const {
        handleSubmit,
        errors,
        values,
        touched,
        handleChange,
        setFieldValue,
        handleBlur,
        resetForm
    } = useFormik({
        initialValues: {
            name: "",
            status: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }
    })
    const handleSubject = async (values) => {
        dispatch(addCountry(values));
    };

    //Edit Modal
    const openEditModal = (data) => {
        setData(data);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };




    const calculateShowingRange = () => {
        const start = (countryData?.currentPage - 1) * countryData.limit + 1;
        const end = Math.min(
            countryData?.currentPage * countryData.limit,
            countryData?.totalItems
        );
        return { start, end };
    };

    const { start, end } = calculateShowingRange();


    const handlePageChange = (event, page) => {
        dispatch(setFilterValues({ page }));
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        dispatch(setFilterValues({ search: e.target.value, page: 1 }));
    };
    const handleOpenMenu = (e) => {
        setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        dispatch(setFilterValues({ sortBy: e.target.value, order, page: 1 }))
    };
    useEffect(() => {
        const getAllCategories = async () => {
            try {
                await dispatch(getAllCountry(filterOptions));
            } catch (error) {
                console.log(error);
            }
        };
        getAllCategories();
    }, [dispatch, filterOptions, isRefresh]);


    //Delete User
    const openDeleteModal = (data) => {
        setData(data);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const deletedData = (value) => {
        dispatch(deleteCountry(value));
    };

      const exportToExcel = async () => {
        const result = await dispatch(getExportCountry()).unwrap();
        console.log("result", result);
        const excelData = result?.data?.map((item) => ({
          Country: item?.name || "_",
          Date: changeDateFormat(item?.createdAt) || "-",
          Status: item?.status === 'ACTIVE' ? `Active` : `Inactive` || "-",
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Category");
        XLSX.writeFile(workbook, "Category.xlsx");
      };

    
    const countries = [
        { code: "AD", label: "Andorra", phone: "376" },
        {
            code: "AE",
            label: "United Arab Emirates",
            phone: "971"
        },
        { code: "AF", label: "Afghanistan", phone: "93" },
        {
            code: "AG",
            label: "Antigua and Barbuda",
            phone: "1-268"
        },
        { code: "AI", label: "Anguilla", phone: "1-264" },
        { code: "AL", label: "Albania", phone: "355" },
        { code: "AM", label: "Armenia", phone: "374" },
        { code: "AO", label: "Angola", phone: "244" },
        { code: "AQ", label: "Antarctica", phone: "672" },
        { code: "AR", label: "Argentina", phone: "54" },
        { code: "AS", label: "American Samoa", phone: "1-684" },
        { code: "AT", label: "Austria", phone: "43" },
        {
            code: "AU",
            label: "Australia",
            phone: "61",
            suggested: true
        },
        { code: "AW", label: "Aruba", phone: "297" },
        { code: "AX", label: "Alland Islands", phone: "358" },
        { code: "AZ", label: "Azerbaijan", phone: "994" },
        {
            code: "BA",
            label: "Bosnia and Herzegovina",
            phone: "387"
        },
        { code: "BB", label: "Barbados", phone: "1-246" },
        { code: "BD", label: "Bangladesh", phone: "880" },
        { code: "BE", label: "Belgium", phone: "32" },
        { code: "BF", label: "Burkina Faso", phone: "226" },
        { code: "BG", label: "Bulgaria", phone: "359" },
        { code: "BH", label: "Bahrain", phone: "973" },
        { code: "BI", label: "Burundi", phone: "257" },
        { code: "BJ", label: "Benin", phone: "229" },
        { code: "BL", label: "Saint Barthelemy", phone: "590" },
        { code: "BM", label: "Bermuda", phone: "1-441" },
        { code: "BN", label: "Brunei Darussalam", phone: "673" },
        { code: "BO", label: "Bolivia", phone: "591" },
        { code: "BR", label: "Brazil", phone: "55" },
        { code: "BS", label: "Bahamas", phone: "1-242" },
        { code: "BT", label: "Bhutan", phone: "975" },
        { code: "BV", label: "Bouvet Island", phone: "47" },
        { code: "BW", label: "Botswana", phone: "267" },
        { code: "BY", label: "Belarus", phone: "375" },
        { code: "BZ", label: "Belize", phone: "501" },
        {
            code: "CA",
            label: "Canada",
            phone: "1",
            suggested: true
        },
        {
            code: "CC",
            label: "Cocos (Keeling) Islands",
            phone: "61"
        },
        {
            code: "CD",
            label: "Congo, Democratic Republic of the",
            phone: "243"
        },
        {
            code: "CF",
            label: "Central African Republic",
            phone: "236"
        },
        {
            code: "CG",
            label: "Congo, Republic of the",
            phone: "242"
        },
        { code: "CH", label: "Switzerland", phone: "41" },
        { code: "CI", label: "Cote d'Ivoire", phone: "225" },
        { code: "CK", label: "Cook Islands", phone: "682" },
        { code: "CL", label: "Chile", phone: "56" },
        { code: "CM", label: "Cameroon", phone: "237" },
        { code: "CN", label: "China", phone: "86" },
        { code: "CO", label: "Colombia", phone: "57" },
        { code: "CR", label: "Costa Rica", phone: "506" },
        { code: "CU", label: "Cuba", phone: "53" },
        { code: "CV", label: "Cape Verde", phone: "238" },
        { code: "CW", label: "Curacao", phone: "599" },
        { code: "CX", label: "Christmas Island", phone: "61" },
        { code: "CY", label: "Cyprus", phone: "357" },
        { code: "CZ", label: "Czech Republic", phone: "420" },
        {
            code: "DE",
            label: "Germany",
            phone: "49",
            suggested: true
        },
        { code: "DJ", label: "Djibouti", phone: "253" },
        { code: "DK", label: "Denmark", phone: "45" },
        { code: "DM", label: "Dominica", phone: "1-767" },
        {
            code: "DO",
            label: "Dominican Republic",
            phone: "1-809"
        },
        { code: "DZ", label: "Algeria", phone: "213" },
        { code: "EC", label: "Ecuador", phone: "593" },
        { code: "EE", label: "Estonia", phone: "372" },
        { code: "EG", label: "Egypt", phone: "20" },
        { code: "EH", label: "Western Sahara", phone: "212" },
        { code: "ER", label: "Eritrea", phone: "291" },
        { code: "ES", label: "Spain", phone: "34" },
        { code: "ET", label: "Ethiopia", phone: "251" },
        { code: "FI", label: "Finland", phone: "358" },
        { code: "FJ", label: "Fiji", phone: "679" },
        {
            code: "FK",
            label: "Falkland Islands (Malvinas)",
            phone: "500"
        },
        {
            code: "FM",
            label: "Micronesia, Federated States of",
            phone: "691"
        },
        { code: "FO", label: "Faroe Islands", phone: "298" },
        {
            code: "FR",
            label: "France",
            phone: "33",
            suggested: true
        },
        { code: "GA", label: "Gabon", phone: "241" },
        { code: "GB", label: "United Kingdom", phone: "44" },
        { code: "GD", label: "Grenada", phone: "1-473" },
        { code: "GE", label: "Georgia", phone: "995" },
        { code: "GF", label: "French Guiana", phone: "594" },
        { code: "GG", label: "Guernsey", phone: "44" },
        { code: "GH", label: "Ghana", phone: "233" },
        { code: "GI", label: "Gibraltar", phone: "350" },
        { code: "GL", label: "Greenland", phone: "299" },
        { code: "GM", label: "Gambia", phone: "220" },
        { code: "GN", label: "Guinea", phone: "224" },
        { code: "GP", label: "Guadeloupe", phone: "590" },
        { code: "GQ", label: "Equatorial Guinea", phone: "240" },
        { code: "GR", label: "Greece", phone: "30" },
        {
            code: "GS",
            label: "South Georgia and the South Sandwich Islands",
            phone: "500"
        },
        { code: "GT", label: "Guatemala", phone: "502" },
        { code: "GU", label: "Guam", phone: "1-671" },
        { code: "GW", label: "Guinea-Bissau", phone: "245" },
        { code: "GY", label: "Guyana", phone: "592" },
        { code: "HK", label: "Hong Kong", phone: "852" },
        {
            code: "HM",
            label: "Heard Island and McDonald Islands",
            phone: "672"
        },
        { code: "HN", label: "Honduras", phone: "504" },
        { code: "HR", label: "Croatia", phone: "385" },
        { code: "HT", label: "Haiti", phone: "509" },
        { code: "HU", label: "Hungary", phone: "36" },
        { code: "ID", label: "Indonesia", phone: "62" },
        { code: "IE", label: "Ireland", phone: "353" },
        { code: "IL", label: "Israel", phone: "972" },
        { code: "IM", label: "Isle of Man", phone: "44" },
        { code: "IN", label: "India", phone: "91" },
        {
            code: "IO",
            label: "British Indian Ocean Territory",
            phone: "246"
        },
        { code: "IQ", label: "Iraq", phone: "964" },
        {
            code: "IR",
            label: "Iran, Islamic Republic of",
            phone: "98"
        },
        { code: "IS", label: "Iceland", phone: "354" },
        { code: "IT", label: "Italy", phone: "39" },
        { code: "JE", label: "Jersey", phone: "44" },
        { code: "JM", label: "Jamaica", phone: "1-876" },
        { code: "JO", label: "Jordan", phone: "962" },
        {
            code: "JP",
            label: "Japan",
            phone: "81",
            suggested: true
        },
        { code: "KE", label: "Kenya", phone: "254" },
        { code: "KG", label: "Kyrgyzstan", phone: "996" },
        { code: "KH", label: "Cambodia", phone: "855" },
        { code: "KI", label: "Kiribati", phone: "686" },
        { code: "KM", label: "Comoros", phone: "269" },
        {
            code: "KN",
            label: "Saint Kitts and Nevis",
            phone: "1-869"
        },
        {
            code: "KP",
            label: "Korea, Democratic People's Republic of",
            phone: "850"
        },
        { code: "KR", label: "Korea, Republic of", phone: "82" },
        { code: "KW", label: "Kuwait", phone: "965" },
        { code: "KY", label: "Cayman Islands", phone: "1-345" },
        { code: "KZ", label: "Kazakhstan", phone: "7" },
        {
            code: "LA",
            label: "Lao People's Democratic Republic",
            phone: "856"
        },
        { code: "LB", label: "Lebanon", phone: "961" },
        { code: "LC", label: "Saint Lucia", phone: "1-758" },
        { code: "LI", label: "Liechtenstein", phone: "423" },
        { code: "LK", label: "Sri Lanka", phone: "94" },
        { code: "LR", label: "Liberia", phone: "231" },
        { code: "LS", label: "Lesotho", phone: "266" },
        { code: "LT", label: "Lithuania", phone: "370" },
        { code: "LU", label: "Luxembourg", phone: "352" },
        { code: "LV", label: "Latvia", phone: "371" },
        { code: "LY", label: "Libya", phone: "218" },
        { code: "MA", label: "Morocco", phone: "212" },
        { code: "MC", label: "Monaco", phone: "377" },
        {
            code: "MD",
            label: "Moldova, Republic of",
            phone: "373"
        },
        { code: "ME", label: "Montenegro", phone: "382" },
        {
            code: "MF",
            label: "Saint Martin (French part)",
            phone: "590"
        },
        { code: "MG", label: "Madagascar", phone: "261" },
        { code: "MH", label: "Marshall Islands", phone: "692" },
        {
            code: "MK",
            label: "Macedonia, the Former Yugoslav Republic of",
            phone: "389"
        },
        { code: "ML", label: "Mali", phone: "223" },
        { code: "MM", label: "Myanmar", phone: "95" },
        { code: "MN", label: "Mongolia", phone: "976" },
        { code: "MO", label: "Macao", phone: "853" },
        {
            code: "MP",
            label: "Northern Mariana Islands",
            phone: "1-670"
        },
        { code: "MQ", label: "Martinique", phone: "596" },
        { code: "MR", label: "Mauritania", phone: "222" },
        { code: "MS", label: "Montserrat", phone: "1-664" },
        { code: "MT", label: "Malta", phone: "356" },
        { code: "MU", label: "Mauritius", phone: "230" },
        { code: "MV", label: "Maldives", phone: "960" },
        { code: "MW", label: "Malawi", phone: "265" },
        { code: "MX", label: "Mexico", phone: "52" },
        { code: "MY", label: "Malaysia", phone: "60" },
        { code: "MZ", label: "Mozambique", phone: "258" },
        { code: "NA", label: "Namibia", phone: "264" },
        { code: "NC", label: "New Caledonia", phone: "687" },
        { code: "NE", label: "Niger", phone: "227" },
        { code: "NF", label: "Norfolk Island", phone: "672" },
        { code: "NG", label: "Nigeria", phone: "234" },
        { code: "NI", label: "Nicaragua", phone: "505" },
        { code: "NL", label: "Netherlands", phone: "31" },
        { code: "NO", label: "Norway", phone: "47" },
        { code: "NP", label: "Nepal", phone: "977" },
        { code: "NR", label: "Nauru", phone: "674" },
        { code: "NU", label: "Niue", phone: "683" },
        { code: "NZ", label: "New Zealand", phone: "64" },
        { code: "OM", label: "Oman", phone: "968" },
        { code: "PA", label: "Panama", phone: "507" },
        { code: "PE", label: "Peru", phone: "51" },
        { code: "PF", label: "French Polynesia", phone: "689" },
        { code: "PG", label: "Papua New Guinea", phone: "675" },
        { code: "PH", label: "Philippines", phone: "63" },
        { code: "PK", label: "Pakistan", phone: "92" },
        { code: "PL", label: "Poland", phone: "48" },
        {
            code: "PM",
            label: "Saint Pierre and Miquelon",
            phone: "508"
        },
        { code: "PN", label: "Pitcairn", phone: "870" },
        { code: "PR", label: "Puerto Rico", phone: "1" },
        {
            code: "PS",
            label: "Palestine, State of",
            phone: "970"
        },
        { code: "PT", label: "Portugal", phone: "351" },
        { code: "PW", label: "Palau", phone: "680" },
        { code: "PY", label: "Paraguay", phone: "595" },
        { code: "QA", label: "Qatar", phone: "974" },
        { code: "RE", label: "Reunion", phone: "262" },
        { code: "RO", label: "Romania", phone: "40" },
        { code: "RS", label: "Serbia", phone: "381" },
        { code: "RU", label: "Russian Federation", phone: "7" },
        { code: "RW", label: "Rwanda", phone: "250" },
        { code: "SA", label: "Saudi Arabia", phone: "966" },
        { code: "SB", label: "Solomon Islands", phone: "677" },
        { code: "SC", label: "Seychelles", phone: "248" },
        { code: "SD", label: "Sudan", phone: "249" },
        { code: "SE", label: "Sweden", phone: "46" },
        { code: "SG", label: "Singapore", phone: "65" },
        { code: "SH", label: "Saint Helena", phone: "290" },
        { code: "SI", label: "Slovenia", phone: "386" },
        {
            code: "SJ",
            label: "Svalbard and Jan Mayen",
            phone: "47"
        },
        { code: "SK", label: "Slovakia", phone: "421" },
        { code: "SL", label: "Sierra Leone", phone: "232" },
        { code: "SM", label: "San Marino", phone: "378" },
        { code: "SN", label: "Senegal", phone: "221" },
        { code: "SO", label: "Somalia", phone: "252" },
        { code: "SR", label: "Suriname", phone: "597" },
        { code: "SS", label: "South Sudan", phone: "211" },
        {
            code: "ST",
            label: "Sao Tome and Principe",
            phone: "239"
        },
        { code: "SV", label: "El Salvador", phone: "503" },
        {
            code: "SX",
            label: "Sint Maarten (Dutch part)",
            phone: "1-721"
        },
        {
            code: "SY",
            label: "Syrian Arab Republic",
            phone: "963"
        },
        { code: "SZ", label: "Swaziland", phone: "268" },
        {
            code: "TC",
            label: "Turks and Caicos Islands",
            phone: "1-649"
        },
        { code: "TD", label: "Chad", phone: "235" },
        {
            code: "TF",
            label: "French Southern Territories",
            phone: "262"
        },
        { code: "TG", label: "Togo", phone: "228" },
        { code: "TH", label: "Thailand", phone: "66" },
        { code: "TJ", label: "Tajikistan", phone: "992" },
        { code: "TK", label: "Tokelau", phone: "690" },
        { code: "TL", label: "Timor-Leste", phone: "670" },
        { code: "TM", label: "Turkmenistan", phone: "993" },
        { code: "TN", label: "Tunisia", phone: "216" },
        { code: "TO", label: "Tonga", phone: "676" },
        { code: "TR", label: "Turkey", phone: "90" },
        {
            code: "TT",
            label: "Trinidad and Tobago",
            phone: "1-868"
        },
        { code: "TV", label: "Tuvalu", phone: "688" },
        {
            code: "TW",
            label: "Taiwan, Province of China",
            phone: "886"
        },
        {
            code: "TZ",
            label: "United Republic of Tanzania",
            phone: "255"
        },
        { code: "UA", label: "Ukraine", phone: "380" },
        { code: "UG", label: "Uganda", phone: "256" },
        {
            code: "US",
            label: "United States",
            phone: "1",
            suggested: true
        },
        { code: "UY", label: "Uruguay", phone: "598" },
        { code: "UZ", label: "Uzbekistan", phone: "998" },
        {
            code: "VA",
            label: "Holy See (Vatican City State)",
            phone: "379"
        },
        {
            code: "VC",
            label: "Saint Vincent and the Grenadines",
            phone: "1-784"
        },
        { code: "VE", label: "Venezuela", phone: "58" },
        {
            code: "VG",
            label: "British Virgin Islands",
            phone: "1-284"
        },
        {
            code: "VI",
            label: "US Virgin Islands",
            phone: "1-340"
        },
        { code: "VN", label: "Vietnam", phone: "84" },
        { code: "VU", label: "Vanuatu", phone: "678" },
        { code: "WF", label: "Wallis and Futuna", phone: "681" },
        { code: "WS", label: "Samoa", phone: "685" },
        { code: "XK", label: "Kosovo", phone: "383" },
        { code: "YE", label: "Yemen", phone: "967" },
        { code: "YT", label: "Mayotte", phone: "262" },
        { code: "ZA", label: "South Africa", phone: "27" },
        { code: "ZM", label: "Zambia", phone: "260" },
        { code: "ZW", label: "Zimbabwe", phone: "263" }
    ];
    return (
        <div style={{ padding: 20, marginTop: 60 }}>
            <div className={catStyle.container}>
                <div>
                    <h2 className={catStyle.categoryText}>Country</h2>
                    <CustomSeparator dashboard="Dashboard" type="Country" />
                </div>
                <div
                    className={catStyle.exportFileStyle}
                  onClick={exportToExcel}
                >
                    <ExportIcon />
                    <span>Export</span>

                </div>
            </div>
            <div className={catStyle.searchStyle} style={{ marginTop: 20 }}>
                <div style={{ width: '50%' }}>
                    <div className={catStyle.search} >

                        <div style={{ cursor: "pointer", marginTop: 5 }}>
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search..."
                        />
                    </div>
                </div>
            </div>
            <div className={countryStyle.viewStyle} style={{ marginTop: 20 }}>
                <div
                    className={countryStyle.countryContainer}
                >
                    <div className={catStyle.header} style={{ paddingLeft: 20 }}>
                        <div className={countryStyle.slNoStyle}> Sl No</div>
                        <div className={catStyle.dropdownStyle}>
                            {" "}
                            <Drop color="#858D9D" />{" "}
                        </div>
                        <div className={countryStyle.countryStyle}> Country </div>
                        <div className={catStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "name" } })}>
                            {" "}
                            <Drop color="#858D9D" />{" "}
                        </div>
                        <div className={countryStyle.statusStyle}>Status</div>
                        <div className={catStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "status" } })}>
                            {" "}
                            <Drop color="#858D9D" />{" "}
                        </div>
                        <div className={countryStyle.dateStyle}>Date</div>
                        <div className={catStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "createdAt" } })}>
                            {" "}
                            <Drop color="#858D9D" />{" "}
                        </div>
                        <div className={countryStyle.action}>Actions</div>
                    </div>
                    <div>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                {countryData?.data?.length > 0 ? (
                                    <div>
                                        {countryData?.data?.map((item, index) => {
                                            return (
                                                <div
                                                    className={catStyle.info}
                                                    key={index}
                                                    style={{ paddingLeft: 20 }}
                                                >
                                                    <div className={countryStyle.slNoStyle}> {index + 1}</div>
                                                    <div className={catStyle.dropdownStyle} />
                                                    <div className={countryStyle.countryStyle} style={{ color: "#1D1F2C" }}>
                                                        {item?.name && item?.name?.length > 30 ? `${item?.name?.substring(0, 30)}...` : item?.name}
                                                    </div>
                                                    <div className={catStyle.dropdownStyle} />
                                                    <div
                                                        style={{
                                                            backgroundColor:
                                                                item?.status === 'ACTIVE' ? "#4DDB4D1A" : "#F29C9C5E",
                                                            width: "13%",
                                                            borderRadius: 8,
                                                            height: 30,
                                                            alignContent: "center",
                                                            justifyContent: "center",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            // marginLeft: 20,
                                                            alignSelf: "center",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontFamily: "DM Sans",
                                                                fontSize: 14,
                                                                fontWeight: "600",
                                                                lineHeight: 18.23,
                                                                letterSpacing: 0.5,
                                                                textAlign: "center",
                                                                color:
                                                                    item?.status === 'ACTIVE' ? "#4DDB4D" : "#F92929",
                                                            }}
                                                        >
                                                            {item?.status === 'ACTIVE' ? "Active" : "Inactive"}
                                                        </span>
                                                    </div>
                                                    <div className={catStyle.dropdownStyle} />
                                                    <div
                                                        className={countryStyle.dateStyle}
                                                        style={{ color: "#667085", }}
                                                    >
                                                        {formatDate(item?.createdAt)}
                                                    </div>
                                                    <div className={catStyle.dropdownStyle} />
                                                    <div className={countryStyle.action}>
                                                        <div onClick={() => openEditModal(item)}><EditIcon /></div>
                                                        <div style={{ marginLeft: 10 }} onClick={() => openDeleteModal(item?._id)}><DeleteIcon /></div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <div
                                            className={productStyle.entryView}
                                            style={{ padding: 20, }}
                                        >
                                            <div className={productStyle.showingText}>
                                                Showing {start}-{end} from {countryData?.totalItems}{" "}

                                            </div>
                                            <Pagination
                                                count={countryData?.totalPages}
                                                page={filterOptions?.page}
                                                onChange={handlePageChange}
                                                shape="rounded"
                                                siblingCount={1} // Show one sibling page (previous and next)
                                                boundaryCount={0} // Do not show first and last buttons
                                                sx={{
                                                    "& .MuiPaginationItem-root": {
                                                        margin: "0 4px",
                                                        color: "#E87819",
                                                        border: "1px solid #E0E2E7",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                        fontFamily: `'Public Sans', sans-serif`,
                                                    },
                                                    "& .Mui-selected": {
                                                        color: "#fff",
                                                        backgroundColor: "#E87819  !important", // custom color for selected page
                                                    },
                                                    "& .MuiPaginationItem-root:hover": {
                                                        color: "#fff",
                                                        backgroundColor: "#E87819", // custom hover color
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <ErrorPage />
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className={countryStyle.addCountryBox}>
                    <h3 className={countryStyle.h3Style}>Add Country</h3>
                    <div style={{ marginTop: 10 }}>
                        <label className={catStyle.label}>Country Name</label>
                        <br />
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            sx={formselect}
                            IconComponent={(props) => (
                                <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                            )}
                            displayEmpty
                            defaultValue=''
                            name='name'
                            value={values.name}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            {countries?.length > 0 && countries?.map((country) => (
                                <MenuItem
                                    key={country.label}
                                    value={country.label}
                                    sx={{
                                        color: values.name === country.label ? "#081735" : "inherit",
                                        fontWeight: values.name === country.label ? "600" : "normal",
                                    }}
                                >
                                    {country.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    }
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <label className={catStyle.label}>Status</label>
                        <br />
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            sx={formselect}
                            IconComponent={(props) => (
                                <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                            )}
                            displayEmpty
                            defaultValue=''
                            name='status'
                            value={values.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value='ACTIVE'>Active</MenuItem>
                            <MenuItem value='INACTIVE'>Inactive</MenuItem>
                        </Select>
                        {
                        errors.status && touched.status && <p style={{ color: "red", fontSize: "12px" }}>{errors.status}</p>
                    }
                    </div>
                    <div className={catStyle.buttons} style={{ marginTop: 20 }}>
                        <Button sx={cancle} onClick={resetForm} variant="contained" disableElevation={true}>Cancel</Button>

                        <Button sx={saveData} onClick={handleSubmit} variant="contained" disableElevation={true}>Save</Button>

                    </div>
                </div>
            </div>
            <DeleteModal
                closeModal={closeDeleteModal}
                open={isDeleteModalOpen}
                data={datas}
                heading={"Delete Country"}
                handleSubject={deletedData}
                description={'Are you sure you want to delete this country?'}
            />
            <EditCountry
                onClose={closeEditModal}
                open={isEditModalOpen}
                data={datas}
            />
        </div>
    );
};
export default Country;

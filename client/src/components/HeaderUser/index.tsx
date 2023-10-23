import './HeaderUser.css'
import React, { useEffect, useState, useRef } from 'react';
import { GoogleLogout } from 'react-google-login';
const clientId: any = "617522400337-v8petg67tn301qkocslk6or3j9c4jjmn.apps.googleusercontent.com";

const HeaderUser = () => {


    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isListVisible, setListVisible] = useState(false); // Sử dụng trạng thái này để quản lý hiển thị danh sách
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    let listTimeout;
    const handleLogout = () => {
        localStorage.clear();
        console.log('User logged out');
    }
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        // Fetch data from your API http://localhost:3000/Courses
        // For simplicity, we're using dummy data here.
        fetch('http://localhost:3000/Courses')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                setFilteredProducts(data);
            });
    }, []);

    const handleSearch = () => {
        const firstChar = searchTerm.charAt(0); // Lấy ký tự đầu tiên từ từ khóa
        const filtered = products.filter((product) =>
            product.courseName.toLowerCase().startsWith(firstChar.toLowerCase())
        );
        setFilteredProducts(filtered.slice(0, 5));
        setListVisible(true);
    };
    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setSearchTerm(inputValue);
        handleSearch(); // Gọi hàm tìm kiếm khi có sự thay đổi trong input
    };
    // Hàm để xóa giá trị trong input
    const handleClearInput = () => {
        setSearchTerm('');
    };
    const handleInputBlur = () => {
        // Chỉ ẩn danh sách nếu input không được focus trong khoảng thời gian trễ
        if (!document.activeElement || !document.activeElement.classList.contains('product-item')) {
            listTimeout = setTimeout(() => {
                setListVisible(false);
            }, 300); // Đặt thời gian trễ là 300 milliseconds (0,3 giây)
        }
    };
    const handleInputFocus = () => {
        // Hủy bỏ khoảng thời gian trễ nếu input được focus trở lại
        clearTimeout(listTimeout);
    };
    // Xử lý sự kiện khi bấm vào một phần tử trong danh sách
    const handleItemClick = (product) => {
        // Thực hiện điều gì đó khi bấm vào một phần tử, ví dụ: chuyển tới trang chi tiết sản phẩm
        window.location.href = `/introduction/${product.id}`;
    };
    return (
        <div className='header-static'>
            <header>
                <div className="containerCss flex-hd">
                    <div className="box1">
                        <div className="logo">
                            <a href="http://localhost:5173/homepage"> <img src="https://f9-zpcloud.zdn.vn/6063566139068766470/d60a9b137ea1adfff4b0.jpg" alt="logo website" /></a>
                        </div>
                    </div>
                    <div className="box2">
                        <div className="left">
                            <a href="http://localhost:5173/browsepage/business"><i className="fa-solid fa-list lups"></i></a>
                            <div className="bolder-css">
                                <form action="">
                                    <input
                                        placeholder='What do you want to learn today?'
                                        type="text"
                                        value={searchTerm}
                                        onInput={handleInputChange}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}  // Sử dụng sự kiện onInput để theo dõi thay đổi trong input
                                    />
                                    {searchTerm && ( // Hiển thị nút xóa chỉ khi có giá trị trong input
                                        <button onClick={handleClearInput} className="clear-button">
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    )}
                                    <button onClick={handleSearch}>
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                    {isListVisible && ( // Sử dụng trạng thái để kiểm tra hiển thị danh sách
                                        <div className="search-results">
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map((product) => (
                                                    <a href={`/introduction/${product.id}`} key={product.id}>
                                                        <div className='flex search-list'>        <div> <img className='w-5' src={product.courseIMG} alt="" /></div><div className='search-blue' onClick={() => handleItemClick(product)}>{product.courseName}</div></div>
                                                    </a>
                                                ))
                                            ) : (
                                                <div className="empty-result">Không tìm thấy!</div>
                                            )}
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                        <div className="right">
                            <ul>
                                <li>
                                    <a className='thea' href="http://localhost:5173/homepage">
                                        <i className="fa-solid fa-house lups"></i>
                                        <div>Home</div>
                                    </a>
                                </li>
                                <li>
                                    <a className='thea' href="http://localhost:5173/mylearning/progress">
                                        <i className="fa-regular fa-file lups"></i>
                                        <div>My learning</div>
                                    </a>
                                </li>
                                <li>

                                    <div className='thea'>
                                        <i className="fa-regular fa-user lups"></i>
                                        <div className="relative">
                                            <div
                                                onClick={toggleDropdown}
                                                className="cursor-pointer"
                                            >
                                                Me <i className={`fa-solid fa-caret-${isDropdownOpen ? 'up' : 'down'} lups-left`}></i>
                                            </div>
                                            {isDropdownOpen && (
                                                <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                                                    {/* Nội dung của dropdown ở đây */}
                                                    <ul>
                                                        <li>
                                                            <GoogleLogout
                                                                clientId={clientId}
                                                                buttonText="Đăng Xuất" // Văn bản trên nút đăng xuất
                                                                onLogoutSuccess={handleLogout} // Callback khi người dùng đăng xuất thành công
                                                            >
                                                            </GoogleLogout>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <a className='thea' href="">
                                        <i className="fa-solid fa-earth-europe lups"></i>
                                        <div>EN<i className="fa-solid fa-caret-down lups-left"></i></div>
                                    </a>
                                </li>

                            </ul>
                            <div className='freemonth'>
                                <a href="">Start my free month</a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <nav>
                <div className="containerCss">
                    <div> Solutions for: </div>
                    <ul>
                        <li><a href="">Business</a></li>
                        <li><a href="">Develop</a></li>
                        <li><a href="">Higher Education</a></li>
                        <li><a href="">| <span className='mr-3'></span> buy for my team</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default HeaderUser
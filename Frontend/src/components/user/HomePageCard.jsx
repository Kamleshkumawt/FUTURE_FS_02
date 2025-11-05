
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCategories } from '../../store/slices/categorySlice';

const HomePageCard = ({data}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //  useEffect(() => {
  //   if (data?.categoryId) {
  //     console.log('categoryId in HomePageCard : ',data.categoryId);
  //     dispatch(setCategories(data.categoryId));
  //   }
  // }, [data?.categoryId, dispatch]);

  return (
    <div 
    onClick={() => {
        const category = data?.categoryId;
        const categoryName = category?.name;

        if (categoryName) {
          dispatch(setCategories(category));  // ✅ Dispatch on click
          navigate(`/category/search/${categoryName}`);
          window.scrollTo(0, 0);
        } else {
          console.warn('Category name is missing');
        }
      }}
    className="max-w-[14rem] rounded-xs overflow-hidden  border border-gray-200 p-3 px-5 space-y-2 cursor-pointer bg-white">

  {/* Image container */}
  <div className="w-full h-48 flex items-center justify-center bg-white ">
    <img
      // src="https://rukminim1.flixcart.com/image/420/420/xif0q/headphone/3/m/u/nb111-wireless-headphone-magnetic-neckband-250h-standby-200mah-original-imah77cwrvwjzbyt.jpeg?q=60"
      src={data?.frontImage.url}
      alt={data?.name}
      className="h-full object-contain"
    />
  </div>

  {/* Text content */}
  <div className="flex flex-col items-start gap-1 ">
    <span className="text-black">{data?.name.slice(0, 20)}</span>
    <span className="text-lg font-semibold text-green-600">Min.{data?.discount?.percentage}% off</span>
  </div>
</div>

  )
}

export default HomePageCard
import React from 'react';
import qs from 'qs';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from '../components/Pagination';
import { SearchContext } from '../App';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {categoryId, sort, currentPage} = useSelector(state => state.filter);
  
  const {searchValue} = React.useContext(SearchContext);
    const [items, setItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);


    const onChangeCategory = (id) => { 
      dispatch(setCategoryId(id));
    };

    const onChangePage = number => {
      dispatch(setCurrentPage(number));
    };

    React.useEffect(() => {
      if (window.location.search){
        const params = qs.parse(window.location.search.substring(1));

        
        
        dispatch(
          setFilters({
            ...params,
            sort, 
          })
        );
      }
    },);

    
    React.useEffect(() => {
      setIsLoading(true);

      const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
      const sortBy = sort.sortProperty.replace('-', '');
      const category =  categoryId > 0 ? `category=${categoryId}` : '';
      const search =  searchValue ? `&search=${searchValue}` : '';


      axios.get(`https://6336ee6f65d1e8ef26765ea6.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
      )
      .then(res => {
        setItems(res.data);
          setIsLoading(false);
      });
      window.scrollTo(0, 0);
    }, [categoryId, sort.sortProperty, searchValue, currentPage]);

    React.useEffect(() => {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });

      navigate(`?${queryString}`);
    }, [categoryId, sort.sortProperty, searchValue, currentPage]);

    const pizzas = items.map(obj => <PizzaBlock key={obj.id} {... obj}/>);

    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
              <div className="content__top">
          <Categories value={categoryId} onChangeCategory={onChangeCategory}/>
          <Sort />
          </div>
          <h2 className="content__title">Все пиццы</h2>
          <div className="content__items">
            {isLoading  ?  skeletons : pizzas}
          </div>
          <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
    </div>
  );
};

export default Home;
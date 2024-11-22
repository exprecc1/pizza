import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setCategoryID, setCurrentPage, setFilters } from '../redux/slices/filter/slice';
import { FilterSliceState } from '../redux/slices/filter/types';
import { SearchPizzaParams, fetchPizzas } from '../redux/slices/pizza/slice';
import { selectPizzaData } from '../redux/slices/pizza/selectors';
import { selectFilter } from '../redux/slices/filter/selectors';
import { list } from '../Components/Sort';

import { Categories, SortPopup, PizzaBlock, Skeleton, Pagination } from '../Components/';

// import Categories from '../Components/Categories';
// import Sort from '../Components/Sort';
// import PizzaBlock from '../Components/PizzaBlock/index';
// import Skeleton from '../Components/PizzaBlock/Skeleton';
// import Pagination from '../Components/Pagination/index';
import { useAppDispatch } from '../redux/store';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);

  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const dispatch = useAppDispatch();

  import('../utils/math').then((math) => {
    console.log(math.add(16, 26));
  });

  const onChangeCategory = React.useCallback((idx: number) => {
    dispatch(setCategoryID(idx));
  }, []);

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const getPizzas = async () => {
    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      }),
    );

    window.scrollTo(0, 0);
  };

  //Если был уже перый рендер и заданы параметры
  // React.useEffect(() => {
  //   if (isMounted.current) {
  //     const queryString = qs.stringify({
  //       sortProperty: sort.sortProperty,
  //       categoryId,
  //       currentPage,
  //     });

  //     navigate(`?${queryString}`);
  //   }
  //   isMounted.current = true;
  // }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  // // Если был первый рендер, то проверяем URL параметры и сохранаяем в редуксе
  // React.useEffect(() => {
  //   if (window.location.search) {
  //     const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;

  //     const sort = list.find((obj) => obj.sortProperty === params.sortBy);

  //     dispatch(
  //       setFilters({
  //         searchValue: params.search,
  //         categoryId: Number(params.category),
  //         currentPage: Number(params.currentPage),
  //         sort: sort || list[0],
  //       }),
  //     );
  //   }
  //   isSearch.current = true;
  // }, []);

  // Если был первый рендер, то запрашиваем пицыы
  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      getPizzas();
    }

    isSearch.current = false;
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);

  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <SortPopup value={sort} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😕</h2>
          <p>К сожалению не удалось получить питсы. Попробуйте повторить попытку позже.</p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

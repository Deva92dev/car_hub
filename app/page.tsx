'use client';

import Image from 'next/image';
import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from '@/components';
import { fetchCars } from '@/utils';
import { NextPage } from 'next';
import { fuels, yearsOfProduction } from '@/constants';
import { useEffect, useState } from 'react';

// NextJs allows you to turn the whole page asynchronous
// if you are using hooks, that page must be client component(use client directive)
// on every page you can extract all searchParams straight from props of a specific page.

// THis is server side Rendering, that's why every search results in scroll up of the page.
// const Home: NextPage = async ({ searchParams }) => {
//   const allCars = await fetchCars({
//     manufacturer: searchParams.manufacturer || 'Toyota',
//     year: searchParams.year || 2022,
//     fuel: searchParams.fuel || '',
//     limit: searchParams.limit || 10,
//     model: searchParams.model || '',
//   });

//   const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

//   console.log(allCars);

//   return (
//     <main className='overflow-hidden'>
//       <Hero />
//       <div className='mt-12 padding-x padding-y max-width' id='discover'>
//         <div className='home__text-container'>
//           <h1 className='text-4xl font-extrabold'>Car Catalogue</h1>
//           <p>Explore the Cars you might like</p>
//         </div>
//         <div className='home__filters'>
//           <SearchBar />
//           <div className='home__filter-container'>
//             <CustomFilter title='fuel' options={fuels} />
//             <CustomFilter title='year' options={yearsOfProduction} />
//           </div>
//         </div>

//         {!isDataEmpty ? (
//           <div className='home__cars-wrapper'>
//             {allCars?.map((car) => (
//               <CarCard car={car} />
//             ))}
//             {/* showing 10 cars per page */}
//             <ShowMore
//               pageNumber={(searchParams.limit || 10) / 10}
//               isNext={(searchParams.limit || 10) > allCars.length}
//             />
//           </div>
//         ) : (
//           <div className='home__error-container'>
//             <h2 className='text-black text-xl font-bold'>Oops, no results</h2>
//             <p>{allCars?.message}</p>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// };

// This is Client Side Rendering to prevent that bug.
const Home: NextPage = () => {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // search states
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');

  // filter states
  const [fuel, setFuel] = useState('');
  const [year, setYear] = useState(2022);

  // pagination state
  const [limit, setLimit] = useState(10);

  const getCars = async () => {
    setLoading(true);

    try {
      const result = await fetchCars({
        // we get them from states
        manufacturer: manufacturer || 'Toyota',
        year: year || 2022,
        fuel: fuel || '',
        model: model || '',
        limit: limit || 10,
      });

      setAllCars(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, [manufacturer, model, year, fuel, limit]);

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  console.log(allCars);

  return (
    <main className='overflow-hidden'>
      <Hero />
      <div className='mt-12 padding-x padding-y max-width' id='discover'>
        <div className='home__text-container'>
          <h1 className='text-4xl font-extrabold'>Car Catalogue</h1>
          <p>Explore the Cars you might like</p>
        </div>
        <div className='home__filters'>
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />
          <div className='home__filter-container'>
            <CustomFilter title='fuel' options={fuels} setFilter={setFuel} />
            <CustomFilter
              title='year'
              options={yearsOfProduction}
              setFilter={setYear}
            />
          </div>
        </div>

        {allCars.length > 0 ? (
          <section>
            <div className='home__cars-wrapper'>
              {allCars?.map((car) => (
                <CarCard car={car} />
              ))}
            </div>

            {loading && (
              <div className='mt-16 w-full flex-center'>
                <Image
                  src='/loader.svg'
                  alt='Loading icon'
                  width={50}
                  height={50}
                  className='object-contain'
                />
              </div>
            )}

            <ShowMore
              pageNumber={limit / 10}
              isNext={limit > allCars.length}
              setLimit={setLimit}
            />
          </section>
        ) : (
          <div className='home__error-container'>
            <h2 className='text-black text-xl font-bold'>Oops, no results</h2>
            <p>{allCars?.message}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;

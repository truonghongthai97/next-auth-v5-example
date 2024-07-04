import apiServices from '@/services';
import Link from 'next/link';
import { cookies, headers } from 'next/headers';

const DynamicLessonPage = async ({ params }) => {
  const lessonId = params?.lessonId || '';
  const arr = ['1', '2'];
  let lesson = null;
  const cookieStore = cookies();

//   await fetch(`https://jsonplaceholder.typicode.com/todos/${lessonId}`, {
//     cache: 'no-store'
//   })
//     .then((response) => response.json())
//     .then((json) => (lesson = json));

    console.log('-----revalidate')
  return (
    <div>
      {arr.map((item) => (
        <Link key={item} href={`/dynamic/${item}`}>
          {item}_______
        </Link>
      ))}
      <p>{Date.now()}</p>

      {/* {JSON.stringify(lesson)} */}
    </div>
  );
};



export default DynamicLessonPage;


// export default function Page() {
//     const headersList = headers()
//     const referer = headersList.get('referer')
//      const arr = ['1', '2'];

//     return <div>Referer: {referer}

//         {arr.map((item) => (
//         <Link key={item} href={`/dynamic/${item}`}>
//           {item}_______
//         </Link>
//       ))}

//      <p>{Date.now()}</p>
//     </div>
//   }
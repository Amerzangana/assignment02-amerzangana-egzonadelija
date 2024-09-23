import { test, expect, APIResponse } from '@playwright/test';
import { faker } from "@faker-js/faker";
import { APIHelper } from './apiHelpers';
import { stringify } from 'querystring';
import { generateRandomPostPayload } from './testData';

const BASE_URL = 'http://localhost:3000';

test.describe("Test Suite Backend V1", ()=>{
  let apiHelper: APIHelper;
  
  test.beforeAll(() => {
    apiHelper = new APIHelper(BASE_URL);


  });

  test('Test case 01 - Get All Posts V2', async ({ request }) => {
    const getPosts = await apiHelper.getAllPosts(request);
    expect(getPosts.ok()).toBeTruthy();

  });

  test('Test case 02 - Create Posts V2', async ({ request }) => {
    const payload = generateRandomPostPayload();
    const createPostResponse = await apiHelper.createpost(request, payload);
    expect(createPostResponse.ok()).toBeTruthy();

    expect(await createPostResponse.json()).toMatchObject({
      title: payload.title,
      views: payload.views
    })
    const getPosts = await apiHelper.getAllPosts(request);
    expect(getPosts.ok()).toBeTruthy();
    expect(await getPosts.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: payload.title, 
          views: payload.views,
        })
      ])
    )
  });


  /**
  test('Test case 01', async ({ request }) => {
  const getPostsResponse = await request.get("http://localhost:3000/posts")
  expect (getPostsResponse.ok()).toBeTruthy();
  expect (getPostsResponse.status()).toBe(200);
  //ApiResponse.status();
  //apiResponce.ok(); 
});
 */
test('test cast 02 - Create Post', async ({ request }) => {
    const payload = {
        "title": faker.lorem.sentence(),
        "views": faker.number.int({min:10, max:100})
    }
    const createPostResponse = await request.post("http://localhost:3000/posts", {
      data: JSON.stringify(payload),
    });
    expect(createPostResponse.ok()).toBeTruthy();
    expect(await createPostResponse.json()).toMatchObject(
      expect.objectContaining({
        title:payload.title,
        views:payload.views
      })
    )
    const getPostsResponse = await request.get("http://localhost:3000/posts")
    expect (getPostsResponse.ok()).toBeTruthy();

    const allPosts = await getPostsResponse.json();
    expect(allPosts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: payload.title, 
          views: payload.views,
        })
      ])
    )
  });

  test('Test case 03 - Delete by id', async ({ request }) => {
    // get all post in order to see the list
    const getPostsResponse = await request.get("http://localhost:3000/posts")
    expect (getPostsResponse.ok()).toBeTruthy(); // assertions
    const allPosts = await getPostsResponse.json();
// get the last element on the list
    const lastButOnePostID = allPosts[allPosts.length -2].id;

    //delete request
    const deletePostResponse = await request.delete(`http://localhost:3000/posts/${lastButOnePostID}`);
    expect (deletePostResponse.ok()).toBeTruthy();
// verify the element is gone
    const deleteEllementResponse = await request.delete(`http://localhost:3000/posts/${lastButOnePostID}`);
    expect ( deleteEllementResponse.status()).toBe(404);

    //    expect (getPostsResponse.status()).toBe(200);
  });
})
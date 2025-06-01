import test, { expect } from "@playwright/test";

// Simple tests to verify REST API endpoints of the FakerestAPI service
// https://fakerestapi.azurewebsites.net
// - see the "Books" endpoints

const version = "v1"; // API version to use

// define an object of expected properties for a book with
// expected types (number or string), but not specific values
const expectedProperties = {
  id: expect.any(Number),
  title: expect.any(String),
  description: expect.any(String),
  pageCount: expect.any(Number),
  excerpt: expect.any(String),
  publishDate: expect.any(String),
};

test("GET - can retrieve all books", async ({ request }) => {
  const response = await request.get(`/api/${version}/Books`);
  expect(response.ok()).toBeTruthy();

  const books = await response.json();
  expect(books.length).toBeGreaterThan(0);

  const [book] = books;
  await expect(book).toEqual(expect.objectContaining(expectedProperties));
});

test("GET - can retrieve an individual book", async ({ request }) => {
  const bookID = 200;
  const response = await request.get(`/api/${version}/Books/${bookID}`);
  expect(response.ok()).toBeTruthy();

  const book = await response.json();
  await expect(book).toEqual(expect.objectContaining(expectedProperties));
});

test("GET - negative: returns 404 for non-existent book", async ({
  request,
}) => {
  const response = await request.get(`/api/${version}/Books/999999`);
  expect(response.status()).toBe(404);
});

test("POST - can create a new book", async ({ request }) => {
  const newBookID = 201;
  const newProperties = {
    id: newBookID,
    title: "Book 201",
    description: "Description for Book 201",
    pageCount: 201,
    excerpt: "Excerpt for Book 201",
    publishDate: "2025-06-01T00:00:00Z",
  };
  const response = await request.post(`/api/${version}/Books`, {
    data: newProperties,
  });
  expect(response.ok()).toBeTruthy();

  const newBook = await response.json();
  await expect(newBook).toEqual(expect.objectContaining(newProperties));
});

test.fixme(
  "POST - negative: cannot create a book with missing required fields",
  async ({ request }) => {
    // This test is marked as fixme because the API is not enforcing required fields
    // and is instead returning a 200 OK response with missing fields.
    // In a real-world scenario, you would expect a 400 Bad Request response. This
    // This would be a case where I would talk to the developer or API provider to
    // fix this issue.

    const incompleteBook = {
      // missing required fields like id, title, etc.
      title: "Incomplete Book",
    };
    const response = await request.post(`/api/${version}/Books`, {
      data: incompleteBook,
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  }
);

test("PUT - can update a book's data", async ({ request }) => {
  const bookID = 200;
  const newProperties = {
    id: 200,
    title: "Book 789",
    description: "Description for Book 789",
    pageCount: 789,
    excerpt: "Excerpt for Book 200",
    publishDate: "2025-06-01T00:00:00Z",
  };

  const response = await request.put(`/api/${version}/Books/${bookID}`, {
    data: newProperties,
  });
  expect(response.ok()).toBeTruthy();

  const updatedBook = await response.json();
  await expect(updatedBook).toEqual(expect.objectContaining(newProperties));
});

test.fixme(
  "PUT - negative: returns 404 when updating non-existent book",
  async ({ request }) => {
    // The API is returning a 200 OK response even when trying to update a
    // non-existent book. I would discuss this with the developers or the
    // API provider to fix this issue.

    const bookID = 999999;
    const newProperties = {
      id: bookID,
      title: "Non-existent Book",
      description: "Should not exist",
      pageCount: 1,
      excerpt: "None",
      publishDate: "2025-06-01T00:00:00Z",
    };
    const response = await request.put(`/api/${version}/Books/${bookID}`, {
      data: newProperties,
    });
    expect(response.status()).toBe(404);
  }
);

test("DELETE - can delete a book", async ({ request }) => {
  const bookID = 200;
  const response = await request.delete(`/api/${version}/Books/${bookID}`);
  expect(response.ok()).toBeTruthy();
});

test.fixme(
  "DELETE - negative: returns 404 when deleting non-existent book",
  async ({ request }) => {
    // The API is returning a 200 OK response even when trying to delete a
    // non-existent book. I would discuss this with the developers or the
    // API provider to fix this issue.
    const bookID = 999999;
    const response = await request.delete(`/api/${version}/Books/${bookID}`);
    expect(response.status()).toBe(404);
  }
);

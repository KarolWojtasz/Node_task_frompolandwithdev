const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return correct question by id', async () => {
    const testID = faker.datatype.uuid()
    const testQuestions = [
      {
        id: testID,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Where are we?',
        author: 'Jack London',
        answers: []
      }

    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestionById(testID)).toStrictEqual(testQuestions[0])
  })

  test('should add question', async () => {
    const testQuestion =
    {
      summary: 'What is my name?',
      author: 'Jack London',
      answers: []
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))
    await questionRepo.addQuestion(testQuestion)

    expect(await questionRepo.getQuestions()).toHaveLength(1)

  })

  test('should not add question with incorrect data', async () => {
    const testQuestion =
    {
      author: 'Jack London',
      answers: []
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))
    await questionRepo.addQuestion(testQuestion)

    expect(await questionRepo.getQuestions()).toHaveLength(0)

  })

  test('should return list of 2 answers from question by id', async () => {
    const testID = faker.datatype.uuid()
    const testQuestion =
      [{
        id: testID,
        author: "John Stockton",
        summary: "What is the shape of the Earth?",
        answers: [
          {
            id: "ce7bddfb-0544-4b14-92d8-188b03c41ee4",
            author: "Brian McKenzie",
            summary: "The Earth is flat."
          },
          {
            id: "d498c0a3-5be2-4354-a3bc-78673aca0f31",
            author: "Dr Strange",
            summary: "It is egg-shaped."
          }
        ]
      }]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestion))

    expect(await questionRepo.getAnswers(testID)).toHaveLength(2)

  })

  test('should return list of 0 answers from question by id', async () => {
    const testID = faker.datatype.uuid()
    const testQuestion =
      [{
        id: testID,
        author: "John Stockton",
        summary: "What is the shape of the Earth?",
        answers: []
      }]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestion))

    expect(await questionRepo.getAnswers(testID)).toHaveLength(0)

  })

  test('should return answer by id', async () => {
    const testQuestionID = faker.datatype.uuid()
    const testAnswerID = faker.datatype.uuid()

    const testAnswer = {
      id: testAnswerID,
      author: "Brian McKenzie",
      summary: "The Earth is flat."
    }

    const testQuestion =
      [{
        id: testQuestionID,
        author: "John Stockton",
        summary: "What is the shape of the Earth?",
        answers: [
          testAnswer,
          {
            id: faker.datatype.uuid(),
            author: "Dr Strange",
            summary: "It is egg-shaped."
          }
        ]
      }]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestion))

    expect(await questionRepo.getAnswer(testQuestionID, testAnswerID)).toStrictEqual(testAnswer)

  })

  test('should add answer for specific question', async () => {
    const testID = faker.datatype.uuid()
    const testQuestion =
      [{
        id: testID,
        author: "John Stockton",
        summary: "What is the shape of the Earth?",
        answers: []
      }]
    const testAnswer = {
      author: "Brian McKenzie",
      summary: "The Earth is flat."
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestion))
    await questionRepo.addAnswer(testID, testAnswer)
    expect(await questionRepo.getAnswers(testID)).toHaveLength(1)

  })

  test('should not add answer with incorrect data', async () => {
    const testID = faker.datatype.uuid()
    const testQuestion =
      [{
        id: testID,
        author: "John Stockton",
        summary: "What is the shape of the Earth?",
        answers: []
      }]
    const testAnswer = {
      summary: "The Earth is flat."
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestion))
    await questionRepo.addAnswer(testID, testAnswer)
    expect(await questionRepo.getAnswers(testID)).toHaveLength(0)

  })


})

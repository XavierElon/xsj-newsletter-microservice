import { NewsletterUser } from '../models/newsletterUser.model'

// GET All newsletter users
export const getAllNewsletterUsers = async (): Promise<any | null> => {
  try {
    const all = await NewsletterUser.find()
    return all
  } catch (error) {
    console.error(`Error retrieving all newsletter users: ${error}`)
    throw new Error('No users found')
  }
}

export const getNewsletterUserByEmail =  async (email: string): Promise<any| null>  => {
  try {
    const User = await NewsletterUser.findOne({ email });
    return User || null;
  } catch (error) {
    console.error(`Error while getting NewsletterUser by email: ${error}`);
    return null;
  }
}

export const getNewsletterUserById =  async (id: string): Promise<any| null>  => {
  try {
    const User = await NewsletterUser.findById(id);
    return User || null;
  } catch (error) {
    console.error(`Error while getting NewsletterUser by email: ${error}`);
    return null;
  }
}

/*
CREATE NewsletterUser
This function creates a new NewsletterUser using the NewsletterUserSchema and saves it to the database
*/
export const createNewsletterUser = async (NewsletterUserData: any): Promise<any> => {
  const user = new NewsletterUser(NewsletterUserData)
  return user
    .save()
    .then((result: any) => {
      return Promise.resolve(result)
    })
    .catch((error: any) => {
      // console.log('Error creating NewsletterUser: ', error)
      throw new Error('Malformed data')
    })
}

/*
CHECK IF NewsletterUser EXISTS by email
check the NewsletterUsername against the database for duplicates before proceeding with creation of new NewsletterUser
*/
export const checkIfNewsletterUserExistsByEmail = async (email: string) => {
  const existingNewsletterUser = await NewsletterUser.findOne({ email });
  if (existingNewsletterUser) {
    return true;
  }
  return false;
};

/*
CHECK IF NewsletterUser EXISTS by ID
check the NewsletterUsername against the database for duplicates before proceeding with creation of new NewsletterUser
*/
export const checkIfNewsletterUserExistsById = async (id: string) => {
  const existingNewsletterUser = await NewsletterUser.findById({ _id: id });
  if (existingNewsletterUser) {
    return true;
  }
  return false;
};

/*
UPDATE NewsletterUser INFORMATION
*/
export const updateNewsletterUserByEmail = async (email: string, update: Partial<any>): Promise<any | null> => {
  // const NewsletterUserModel: Model<Document & typeof NewsletterUser> = mongoose.model('NewsletterUser');
  try {
    const updatedNewsletterUser = await NewsletterUser.findOneAndUpdate({ email: email }, update, { new: true });
    return updatedNewsletterUser;
  } catch (error) {
    console.error(`Error updating NewsletterUser: ${error}`);
    return null;
  }
};

/*
UPDATE NewsletterUser INFORMATION
*/
export const updateNewsletterUserById = async (id: string, update: Partial<any>): Promise<any | null> => {
  // const NewsletterUserModel: Model<Document & typeof NewsletterUser> = mongoose.model('NewsletterUser');
  try {
    const updatedNewsletterUser = await NewsletterUser.findOneAndUpdate({ _id: id }, { ...update, date: Date.now() }, { new: true });
    return updatedNewsletterUser;
  } catch (error) {
    console.error(`Error updating NewsletterUser: ${error}`);
    throw new Error('Bad data')
  }
};

/*
DELETE NewsletterUser by email
*/
export const deleteNewsletterUserByEmail = async (email: string): Promise<any | null> => {

  try {
    const deletedNewsletterUser = await NewsletterUser.findOneAndDelete({ email });
    return deletedNewsletterUser;
  } catch (err) {
    console.error(err);
    throw new Error('Bad data')
  }
}

/*
DELETE NewsletterUser by id
*/
export const deleteNewsletterUserById = async (id: string): Promise<any | null> => {

  try {
    const deletedNewsletterUser = await NewsletterUser.findOneAndDelete({ _id: id });
    return deletedNewsletterUser;
  } catch (err) {
    console.error(err);
    throw new Error('Bad data')
  }
}
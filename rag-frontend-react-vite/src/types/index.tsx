export interface QAResponse {
  question: string;
  answer: string;
  matched_chunks: string[];
}

export interface DocumentFile {
  id: string;
  name: string;
  documentId: string;
  status: string;
  type: "pdf";
  size: string;
  pages: number;
}

export type Errors = {
  email?: string;
  password?: string;
};

export type signupErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  acceptTerms?: string;
  terms?: string;
};


export type AccessToken = {
  sub: string;
  role: string;
  username: string;
  userId: string;
  email: string;
};

export type SignupUserData = {
    username:string,
    email: string;
    password: string;
    role?: string;
    confirmPassword?: string;
}

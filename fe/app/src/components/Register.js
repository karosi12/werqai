import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Link } from "react-router-dom";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const FULLNAME_REGEX = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
const PHONE_NUMBER_REGEX = /^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/;

const REGISTER_URL = 'signup';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [fullName, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [fullNameFocus, setUserFocus] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [validPhoneNumber, setValidPhoneNumber] = useState(false);
    const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);


    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(FULLNAME_REGEX.test(fullName));
    }, [fullName])

    useEffect(() => {
        setValidPhoneNumber(PHONE_NUMBER_REGEX.test(phoneNumber));
    }, [phoneNumber])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatch(password === matchPwd);
    }, [password, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [fullName, email, phoneNumber, password, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = FULLNAME_REGEX.test(fullName);
        const v2 = PWD_REGEX.test(password);
        const v3 = EMAIL_REGEX.test(email);
        const v4 = PHONE_NUMBER_REGEX.test(phoneNumber);
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            await axios.post(REGISTER_URL,
                JSON.stringify({ fullName, password, email, phoneNumber }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            setSuccess(true);
            //clear state and controlled inputs
            setUser('');
            setEmail('');
            setPwd('');
            setPhoneNumber('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="fullname">
                            FullName:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !fullName ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="fullname"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={fullName}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={fullNameFocus && fullName && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Match one or more letters <br />
                            (both uppercase and lowercase)<br />
                            Match zero or more occurrences of a space <br />
                            hyphen, or apostrophe followed by one or more letters.
                        </p>

                        <label htmlFor="email">
                            Email:
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="uidemail"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="uidemail" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>

                        <label htmlFor="phoneNumber">
                            PhoneNumber:
                            <FontAwesomeIcon icon={faCheck} className={validPhoneNumber ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPhoneNumber || !email ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="phoneNumber"
                            autoComplete="off"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phoneNumber}
                            required
                            // aria-invalid={validPhoneNumber ? "false" : "true"}
                            aria-describedby="uidphone"
                            onFocus={() => setPhoneNumberFocus(true)}
                            onBlur={() => setPhoneNumberFocus(false)}
                        />
                        <p id="uidphone" className={phoneNumberFocus && phoneNumber && !validPhoneNumber ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>

                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !password ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            <Link to="/login">Sign In</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register

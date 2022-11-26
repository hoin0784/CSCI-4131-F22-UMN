#!/usr/bin/env python3
import socket
from os import path
from base64 import b64decode
from urllib.parse import unquote_plus
from typing import Union, Tuple, Dict
from threading import Thread
BUFF_SIZE = 8192

# Equivalent to CRLF, named NEWLINE for clarity
NEWLINE = "\r\n"

HTTP_REQ_HEADER_END = (NEWLINE + NEWLINE).encode("utf-8")

# This class is 100% built for you. It uses slightly fancier versions of code like we saw in class.
# YOU WILL NEED TO READ (at least) THE DOCSTRINGS AND FUNCTION NAMES HERE!


class Request:
    """Holds the data which a client sends in a request

    `method` is a string of the HTTP method which the client's request was in.
    For example: GET or POST.

    `headers` is a dictionary of all lowercase key to value pairs. For Example:
      - accept: 'text/html'
      - accept-charset: 'UTF-8'

    `content` is a possibly empty string of whatever content was included in the
    client's request.
    """

    def __init__(self, start_line: str, headers: Dict[str, str], content: str):
        self.method, self.path, *_ = start_line.split()
        # remove leading "/" from the path
        self.path = self.path[1:]
        self.headers = headers
        self.content = content

# provided complete


def recv_until_crlfs(sock) -> Request:
    def to_tuple(kvstr: str) -> Tuple[str, str]:
        k, v = kvstr.split(":", 1)
        # we could have capitalized header or all lowercase, normalize it
        # so we can do a proper lookup
        return (k.lower(), v)

    header_data = b""
    content = b""
    content_bytes_read = 0
    while True:
        data = sock.recv(BUFF_SIZE)
        if not data:
            break
        # Request headers end with two CRLFs
        if HTTP_REQ_HEADER_END in data:
            header_end_idx = data.find(HTTP_REQ_HEADER_END)
            header_data += data[:header_end_idx]
            # How much content did we prematurely recieve from the client
            content_bytes_read = max(0, len(data) - header_end_idx - 4)
            content += data[header_end_idx + 4:]
            break
        header_data += data
    # read the rest of the content that we need to based on content-length
    headers = header_data.decode("utf-8")
    header_list = headers.split(NEWLINE)
    header_kvs = dict(map(to_tuple, header_list[1:]))
    if content_bytes_read != 0:
        if "content-length" not in header_kvs:
            # No content length header... keep reading until end
            while True:
                data = sock.recv(BUFF_SIZE)
                if not data:
                    break
                content += data
        else:
            content_len = int(header_kvs["content-length"])
            to_recv = max(0, content_len - content_bytes_read)
            content += sock.recv(to_recv)
    return Request(header_list[0], header_kvs, content.decode("utf-8"))


# Let's define some functions to help us deal with files, since reading them
# and returning their data is going to be a very common operation.
# Both functions are provided complete and correct.

def get_file_contents(file_name: str) -> str:
    """Returns the text content of `file_name`"""
    with open(file_name, "r") as f:
        return f.read()


def get_file_binary_contents(file_name: str) -> bytes:
    """Returns the binary content of `file_name`"""
    with open(file_name, "rb") as f:
        return f.read()


# This set will hold all of the resources which you want to be gated behind some
# form of authorization. For the purposes of this assignment, keeping only
# private.html is good enough.
# You should not need to change this.
private_files = set(["private.html"])


def has_permission(file_name: str) -> bool:
    """Returns `True` if the `file_name` should be publicly available"""
    return file_name not in private_files


def file_exists(file_name: str) -> bool:
    """Returns `True` if `file_name` exists, this is just a wrapper for the
    os.path.exists function so that it's more visible"""
    return path.exists(file_name)


# Some files should be read in plain text, whereas others should be read
# as binary. To maintain a mapping from file types to their expected form, we
# have a `set` that maintains membership of file extensions expected in binary.
# We've defined a starting point for this set, which you may add to as
# necessary.
# TODO: Finish this set with all relevant files types that should be read in
# binary
binary_type_files = set(["jpg", "jpeg", "png", "mp3"])


def should_return_binary(file_extension: str) -> bool:
    """
    Returns `True` if the file with `file_extension` should be sent back as
    binary.
    """
    return file_extension in binary_type_files


# For a client to know what sort of file you're returning, it must have what's
# called a MIME type. We will maintain a `dictionary` mapping file extensions
# to their MIME type so that we may easily access the correct type when
# responding to requests.
# TODO: Finish this dictionary with all required MIME types
MimeType = str
Response = bytes
mime_types: Dict[str, MimeType] = {
    "html": "text/html",
    "css": "text/css",
    "js":  "application/javascript",
    "png": "image/png",
    "mp3": "audio/mpeg"
}


def get_file_mime_type(file_extension: str) -> MimeType:
    """
    Returns the MIME type for `file_extension` if present, otherwise
    returns the MIME type for plain text.
    """
    if file_extension not in mime_types:
        return "text/plain"
    return mime_types[file_extension]


# TODO: This is not completely built -- you will need to finish it, or replace it with comperable behavior.
class ResponseBuilder:
    """
    This class is here for your use if you want to use it. This follows
    the builder design pattern to assist you in forming a response. An
    example of its use is in the `method_not_allowed` function.
    """

    def __init__(self):
        """
        Initialize the parts of a response to nothing (I.E. by default -- no response)
        """
        self.headers = []
        self.status = None
        self.content = None

    def add_header(self, header_key: str, header_value: Union[str, int]) -> None:
        """Adds a new header to the response"""
        self.headers.append(f"{header_key}: {header_value}")

    def set_status(self, status_code: Union[str, int], status_message: str) -> None:
        """Sets the status of the response"""
        self.status = f"HTTP/1.1 {status_code} {status_message}"

    def set_content(self, content: Union[str, bytes]) -> None:
        """Sets `self.content` to the bytes of the content"""
        if isinstance(content, (bytes, bytearray)):
            self.content = content
        else:
            self.content = content.encode("utf-8")

    def build(self) -> bytes:
        """
        Returns the utf-8 bytes of the response.

        Uses the `self.status`, `self.headers`, and `self.content` to form
        an HTTP response in valid formatting per w3c specifications, which
        can be seen here:
          https://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html

        Where CRLF is our `NEWLINE` constant.
        """
        # TODO: this function

        #builder.headers = ['Connection: close', 'Content-Type: text/html', 'Content-Length: 158']
        #builder.content = 404.html contents
        #builder.status = HTTP/1.1 404 Not Found

        Response = self.status + NEWLINE

        for head in self.headers:
            Response += head + NEWLINE

        Response += NEWLINE
        Response = Response.encode("utf-8")

        if self.content is not None:
            Response += self.content

        return Response


class HTTPServer:
    """
    Our actual HTTP server which will service GET, POST, and HEAD requests.
    """

    def __init__(self, host="localhost", port=9001, directory="."):
        print(f"Server started. Listening at http://{host}:{port}/")
        self.host = host
        self.port = port
        self.working_dir = directory

        self.setup_socket()
        self.accept()

        self.teardown_socket()

    def setup_socket(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind((self.host, self.port))
        self.sock.listen(128)

    def teardown_socket(self):
        if self.sock:
           self.sock.shutdown()
           self.sock.close()

    def accept(self):
        while True:
            (client, address) = self.sock.accept()
            th = Thread(target=self.accept_request, args=(client, address))
            th.start()

    def accept_request(self, client_sock, client_addr):
        req = recv_until_crlfs(client_sock)

        response = self.process_response(req)
        client_sock.send(response)

        # clean up
        client_sock.shutdown(1)
        client_sock.close()

    def process_response(self, request: Request) -> bytes:
        if request.method == "GET":
            return self.get_request(request)
        if request.method == "POST":
            return self.post_request(request)
        if request.method == "HEAD":
            return self.head_request(request)
        return self.method_not_allowed()

    # TODO: Write the response to a GET request
    # 6.1 Basic GET server
    # 2
    def get_request(self, request: Request) -> Response:
        
        file = request.path                                                         
        redirect = file.split('?')[0]                                               # redirect?query_string=http+request,                                     

        if redirect == "redirect":
            Search = file.split("string=")[1]                                       # Take out the query, which I want for search 
                                                                                    # If I want to search http request from youtube then (http+request)
            youtubeLink = "https://www.youtube.com/results?search_query=" + Search  # put the query of(http+request) to the youtube link

            builder = ResponseBuilder()
            builder.set_status("307", "Temporary Redirect")
            allowed = ", ".join(["GET", "POST", "HEAD"])
            builder.add_header("Allow", allowed)
            builder.add_header("Location", youtubeLink)
            builder.add_header("Connection", "close")
            builder.set_content(youtubeLink)
            Response = builder.build()

            return Response

        elif not file_exists(request.path):                                         # return 404.html
            return self.resource_not_found()

        elif not has_permission(request.path):
            userName = ""
            password = ""

            if "authorization" in request.headers:
                # pull the value
                val = request.headers["authorization"]
                val = val.split()[-1]

                val = b64decode(val).decode()

                userName = val.split(":")[0]
                password = val.split(":")[1]

            if userName == "admin" and password == "password":

                filename = "private.html"
                extension = filename.split('.')[-1]

                builder = ResponseBuilder()
                builder.add_header("Connection", "close")
                builder.add_header(
                    "Content-Type", get_file_mime_type(extension))

                builder.set_content(get_file_contents(filename))
                builder.set_status("200", "OK")
                builder.add_header("Content-Length", len(builder.content))
                
                return builder.build()

            else:
                filename = "401.html"
                extension = filename.split('.')[-1]

                builder = ResponseBuilder()
                builder.add_header("Connection", "close")
                builder.add_header("Content-Type", get_file_mime_type(extension))
                builder.add_header("www-Authenticate","Basic realm= User Visible Realm")

                builder.set_content(get_file_contents(filename))
                builder.set_status("401", "UNAUTHORIZED")
                builder.add_header("Content-Length", len(builder.content))

                return builder.build()

        else:
            filename = request.path
            extension = filename.split('.')[-1]

            if should_return_binary(extension) == True:
                openfile = get_file_binary_contents(filename)
            else:
                openfile = get_file_contents(filename)

            builder = ResponseBuilder()
            builder.set_status("200", "OK")
            allowed = ", ".join(["GET", "POST", "HEAD"])
            builder.add_header("Allow", allowed)
            builder.add_header("Connection", "close")
            builder.set_content(openfile)
            builder.add_header("Content-Type", get_file_mime_type(extension))
            builder.add_header("Content-Length", len(builder.content))
            Response = builder.build()

            return Response

    # TODO: Write the response to a POST request
    # 7.3 POST request
    # 3
    def post_request(self, request: Request) -> Response:

        postline = unquote_plus(request.content, encoding='utf-8', errors='replace')

        postline = postline.split('&')
       
        tempkey = []
        tempvalue = []

        for temp in postline:
            temp = temp.split("=")
            tempkey.append(temp[0])
            tempvalue.append(temp[1])

        HTML = (
            "<html>\n" +
                "<head>\n" +
                    "<link rel=" + " \" " + "stylesheet" + " \" " +
                        " type=" + " \" " + "text/css" + " \" " +
                            " href=" + " \" " + "style.css" + " \" " + " />" +
                    "<title>Submit</title>\n" +
                "</head>\n" +

            "<body>\n" +
                "<h1> Submitted Successfully:</h1>\n" +
                "<table>\n"
                    "<tr>" +
                    "<th>" + tempkey[0] + "</th>" +
                    "<td>" + tempvalue[0] + "</td>\n" + "</tr>" +
                    "<tr>" +
                    "<th>" + tempkey[1] + "</th>" +
                    "<td>" + tempvalue[1] + "</td>\n" + "</tr>" +
                    "<tr>" +
                    "<th>" + tempkey[2] + "</th>" +
                    "<td>" + tempvalue[2] + "</td>\n" + "</tr>" +
                    "<tr>" +
                    "<th>" + tempkey[3] + "</th>" +
                    "<td>" + tempvalue[3] + "</td>\n" + "</tr>" +
                    "<tr>" +
                    "<th>" + tempkey[4] + "</th>" +
                    "<td>" + tempvalue[4] + "</td>\n" + "</tr>" +
                    "<tr>" +
                    "<th>" + tempkey[5] + "</th>" +
                    "<td>" + tempvalue[5] + "</td>\n" + "</tr>" +
                "</table>\n" +
            "</body>\n" +
        "</html>")

        builder = ResponseBuilder()
        builder.set_status("200", "OK")
        allowed = ", ".join(["GET", "POST", "HEAD"])
        builder.add_header("Allow", allowed)
        builder.add_header("Connection", "close")
        HTML = bytes(HTML, "utf-8")

        builder.content = HTML
        builder.add_header("Content-Type", get_file_mime_type("html"))
        builder.add_header("Content-Length", len(builder.content))

        Response = builder.build()

        return Response

    # TODO: Write the head request function
    # 6.3 Head Request type
    def head_request(self, request: Request) -> Response:
        """
        Responds to a HEAD request with the exact same requirements as a GET
        request, but should not contain any content.

        HINT: you can _remove_ content from a ResponseBuilder...
        """

        file = request.path
        redirect = file.split('?')[0]

        if redirect == "redirect":
            URL = file.split("string=")[1]
            youtubeLink = "https://www.youtube.com/results?search_query=" + URL

            builder = ResponseBuilder()
            builder.set_status("307", "Temporary Redirect")
            allowed = ", ".join(["GET", "POST", "HEAD"])
            builder.add_header("Allow", allowed)
            builder.add_header("Location", youtubeLink)
            builder.add_header("Connection", "close")
            builder.set_content(youtubeLink)

            # Make the new deleteContent
            # For deleting builder.content (After that it will be 'none')

            deleteContent = ResponseBuilder()
            builder.content = deleteContent.content

            Response = builder.build()

            return Response

        elif not file_exists(request.path):
            Response = self.resource_not_found()

            # After the function of resource_not_found
            # Delete the content of the Response by spliting 

            Response = Response.split(b'\r\n\r\n<!')
            return (Response[0])

        elif not has_permission(request.path):
            userName = ""
            password = ""

            if "authorization" in request.headers:
                # pull the value
                val = request.headers["authorization"]
                val = val.split()[-1]

                val = b64decode(val).decode()

                userName = val.split(":")[0]
                password = val.split(":")[1]

            if userName == "admin" and password == "password":

                filename = "private.html"
                extension = filename.split('.')[-1]

                builder = ResponseBuilder()
                builder.add_header("Connection", "close")
                builder.add_header(
                    "Content-Type", get_file_mime_type(extension))

                builder.set_content(get_file_contents(filename))
                builder.set_status("200", "OK")
                builder.add_header("Content-Length", len(builder.content))

                # Make the new deleteContent
                # For deleting builder.content (After that it will be 'none')

                deleteContent = ResponseBuilder()
                builder.content = deleteContent.content

                return builder.build()

            else:
                filename = "401.html"
                extension = filename.split('.')[-1]

                builder = ResponseBuilder()
                builder.add_header("Connection", "close")
                builder.add_header(
                    "Content-Type", get_file_mime_type(extension))
                builder.add_header("www-Authenticate",
                                   "Basic realm= User Visible Realm")

                builder.set_content(get_file_contents(filename))
                builder.set_status("401", "UNAUTHORIZED")
                builder.add_header("Content-Length", len(builder.content))

                # Make the new deleteContent
                # For deleting builder.content (After that it will be 'none')

                deleteContent = ResponseBuilder()
                builder.content = deleteContent.content

                return builder.build()

        else:
            filename = request.path
            extension = filename.split('.')[-1]

            if should_return_binary(extension) == True:
                openfile = get_file_binary_contents(filename)
            else:
                openfile = get_file_contents(filename)

            builder = ResponseBuilder()
            builder.set_status("200", "OK")
            allowed = ", ".join(["GET", "POST", "HEAD"])
            builder.add_header("Allow", allowed)
            builder.add_header("Connection", "close")
            builder.set_content(openfile)
            builder.add_header("Content-Type", get_file_mime_type(extension))
            builder.add_header("Content-Length", len(builder.content))

            # Make the new deleteContent
            # For deleting builder.content (After that it will be 'none')

            deleteContent = ResponseBuilder()
            builder.content = deleteContent.content

            Response = builder.build()

            return Response

    def method_not_allowed(self) -> Response:
        """
        Returns 405 not allowed status and gives allowed methods.

        TODO: If (and only if)  you are not going to complete the `ResponseBuilder`,
        This must be rewritten.
        """
        builder = ResponseBuilder()
        builder.set_status("405", "METHOD NOT ALLOWED")
        allowed = ", ".join(["GET", "POST", "HEAD"])
        builder.add_header("Allow", allowed)
        builder.add_header("Connection", "close")

        return builder.build()

    # TODO: Write 404 error
    def resource_not_found(self) -> Response:

        #builder.headers = ['Connection: close', 'Content-Type: text/html', 'Content-Length: 158']
        #builder.content = 404.html contents
        #builder.status = HTTP/1.1 404 Not Found
        """
        Returns 404 not found status and sends back our 404.html page.
        """
        filename = '404.html'
        extension = filename.split('.')[-1]  # extension -> html

        builder = ResponseBuilder()
        builder.add_header("Connection", "close")  # Connection: close
        # Connection: close Content-Type: text/html
        builder.add_header("Content-Type", get_file_mime_type(extension))

        # reading the 404.html file
        # Maybe read the 404.html , which is 404:not found ( set the content)
        builder.set_content(get_file_contents(filename))
        builder.set_status("404", "Not FOUND")
        builder.add_header("Content-Length", len(builder.content))

        return builder.build()


if __name__ == "__main__":
    HTTPServer()

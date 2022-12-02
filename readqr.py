import cv2
# read the QRCODE image
img = cv2.imread("site.png")

detector = cv2.QRCodeDetector()
data, bbox, straight_qrcode = detector.detectAndDecode(img)


if bbox is not None:
    print(f"QRCode data:\n{data}")

# display the result
cv2.imshow("img", img)
cv2.waitKey(0)
cv2.destroyAllWindows()



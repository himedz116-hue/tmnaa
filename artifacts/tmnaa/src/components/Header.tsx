import headerImg from '@assets/تصميم_بدون_عنوان_(16)_1785168804032.png';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <img
        src={headerImg}
        alt="TMNAA Header"
        className="w-full h-auto block"
        style={{ display: 'block' }}
      />
    </header>
  );
}

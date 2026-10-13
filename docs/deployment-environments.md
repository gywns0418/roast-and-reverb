# 운영 / 개발 배포 분리 준비

2026-10-13. main은 운영, dev는 개발로 구분한다.

- 운영: https://gywns0418.github.io/roast-and-reverb/ (main)
- 개발: https://gywns0418.github.io/roast-and-reverb/dev/ (dev)
- main 또는 dev push 시 두 브랜치를 각각 checkout/test/build하여 하나의 Pages artifact로 배포한다. feature 브랜치 push와 수동 실행은 배포할 수 없다.
- GitHub Pages는 저장소당 한 사이트이므로 같은 사이트의 별도 경로에 두 빌드 결과를 포함한다. dev 변경이 운영 빌드의 소스가 되지 않는다.
- 두 경로 모두 현재 브라우저 체험 모드이며 실제 백엔드 서버 환경 분리는 아니다. 같은 origin의 localStorage는 공유하므로 독립 계정/데이터 환경으로 해석하지 않는다.
- 사용자가 이번 완료된 dev 구현의 main 반영을 승인했다. main/dev 빌드 중 하나라도 실패하면 배포하지 않아 기존 공개 사이트를 보존한다.
- 기존 feature 브랜치의 workflow도 운영 배포를 계속 할 수 있으므로 전환 시 GitHub github-pages environment의 deployment branch policy를 main/dev로 제한해야 한다.
- 이번 main 반영은 완료된 dev 구현(PR #9까지)과 배포 분리 설정이다. 진행 중인 bean-discovery의 미커밋 개발 파일은 보존했다.
